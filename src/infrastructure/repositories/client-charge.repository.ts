import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IClientChargeRepository } from '../../domain/repositories/client-charge.repository.interface';
import { ClientCharge } from '../../domain/interfaces/client-charge.interface';
import { ClientChargeDocument } from '../schemas/client-charge.schema';
import { ClientChargeFilterDto } from '../../application/dto/client-charge-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class ClientChargeRepository implements IClientChargeRepository {
  constructor(
    @InjectModel('ClientCharge') private clientChargeModel: Model<ClientChargeDocument>,
  ) {}

  async create(clientCharge: Omit<ClientCharge, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientCharge> {
    const createdCharge = new this.clientChargeModel(clientCharge);
    const savedCharge = await createdCharge.save();
    return this.mapToDomain(savedCharge);
  }

  async findAll(filters?: ClientChargeFilterDto): Promise<ClientCharge[]> {
    const query: any = {};

    if (filters?.projectId) {
      query.projectId = filters.projectId;
    }

    if (filters?.minAmount) {
      query.amount = { $gte: filters.minAmount };
    }

    if (filters?.maxAmount) {
      if (query.amount) {
        query.amount.$lte = filters.maxAmount;
      } else {
        query.amount = { $lte: filters.maxAmount };
      }
    }

    if (filters?.currency) {
      query.currency = filters.currency;
    }

    if (filters?.startDate) {
      query.date = { $gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      if (query.date) {
        query.date.$lte = new Date(filters.endDate);
      } else {
        query.date = { $lte: new Date(filters.endDate) };
      }
    }

    if (filters?.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters?.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const charges = await this.clientChargeModel.find(query).sort({ createdAt: -1 }).exec();
    return charges.map(charge => this.mapToDomain(charge));
  }

  async findAllPaginated(filters?: ClientChargeFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<ClientCharge>> {
    const query: any = {};

    if (filters?.projectId) {
      query.projectId = filters.projectId;
    }

    if (filters?.minAmount) {
      query.amount = { $gte: filters.minAmount };
    }

    if (filters?.maxAmount) {
      if (query.amount) {
        query.amount.$lte = filters.maxAmount;
      } else {
        query.amount = { $lte: filters.maxAmount };
      }
    }

    if (filters?.currency) {
      query.currency = filters.currency;
    }

    if (filters?.startDate) {
      query.date = { $gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      if (query.date) {
        query.date.$lte = new Date(filters.endDate);
      } else {
        query.date = { $lte: new Date(filters.endDate) };
      }
    }

    if (filters?.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters?.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [charges, total] = await Promise.all([
      this.clientChargeModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.clientChargeModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: charges.map(charge => this.mapToDomain(charge)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findByProjectId(projectId: string, includeDeleted?: boolean): Promise<ClientCharge[]> {
    const query: any = { projectId };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const charges = await this.clientChargeModel.find(query).exec();
    return charges.map(charge => this.mapToDomain(charge));
  }

  async findById(id: string, includeDeleted?: boolean): Promise<ClientCharge | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const charge = await this.clientChargeModel.findOne(query).exec();
    return charge ? this.mapToDomain(charge) : null;
  }

  async update(id: string, clientCharge: Partial<ClientCharge>): Promise<ClientCharge | null> {
    const updatedCharge = await this.clientChargeModel
      .findByIdAndUpdate(id, clientCharge, { new: true })
      .exec();
    return updatedCharge ? this.mapToDomain(updatedCharge) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.clientChargeModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
    return !!result;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.clientChargeModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.clientChargeModel
      .findByIdAndUpdate(id, { $unset: { deletedAt: 1 } }, { new: true })
      .exec();
    return !!result;
  }

  private mapToDomain(chargeDocument: ClientChargeDocument): ClientCharge {
    return {
      id: chargeDocument._id.toString(),
      projectId: chargeDocument.projectId.toString(),
      amount: chargeDocument.amount,
      currency: chargeDocument.currency,
      date: chargeDocument.date,
      paymentMethod: chargeDocument.paymentMethod,
      description: chargeDocument.description,
      createdAt: chargeDocument.createdAt,
      updatedAt: chargeDocument.updatedAt,
      deletedAt: chargeDocument.deletedAt,
    };
  }
} 