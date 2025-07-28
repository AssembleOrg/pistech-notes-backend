import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPartnerPaymentRepository } from '../../domain/repositories/partner-payment.repository.interface';
import { PartnerPayment } from '../../domain/interfaces/partner-payment.interface';
import { PartnerPaymentDocument } from '../schemas/partner-payment.schema';
import { PartnerPaymentFilterDto } from '../../application/dto/partner-payment-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class PartnerPaymentRepository implements IPartnerPaymentRepository {
  constructor(
    @InjectModel('PartnerPayment') private partnerPaymentModel: Model<PartnerPaymentDocument>,
  ) {}

  async create(partnerPayment: Omit<PartnerPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<PartnerPayment> {
    const createdPayment = new this.partnerPaymentModel(partnerPayment);
    const savedPayment = await createdPayment.save();
    return this.mapToDomain(savedPayment);
  }

  async findAll(filters?: PartnerPaymentFilterDto): Promise<PartnerPayment[]> {
    const query: any = {};

    if (filters?.projectId) {
      query.projectId = filters.projectId;
    }

    if (filters?.partnerName) {
      query.partnerName = { $regex: filters.partnerName, $options: 'i' };
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

    const payments = await this.partnerPaymentModel.find(query).sort({ createdAt: -1 }).exec();
    return payments.map(payment => this.mapToDomain(payment));
  }

  async findAllPaginated(filters?: PartnerPaymentFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<PartnerPayment>> {
    const query: any = {};

    if (filters?.projectId) {
      query.projectId = filters.projectId;
    }

    if (filters?.partnerName) {
      query.partnerName = { $regex: filters.partnerName, $options: 'i' };
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

    const [payments, total] = await Promise.all([
      this.partnerPaymentModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.partnerPaymentModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: payments.map(payment => this.mapToDomain(payment)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findByProjectId(projectId: string, includeDeleted?: boolean): Promise<PartnerPayment[]> {
    const query: any = { projectId };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const payments = await this.partnerPaymentModel.find(query).exec();
    return payments.map(payment => this.mapToDomain(payment));
  }

  async findById(id: string, includeDeleted?: boolean): Promise<PartnerPayment | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const payment = await this.partnerPaymentModel.findOne(query).exec();
    return payment ? this.mapToDomain(payment) : null;
  }

  async update(id: string, partnerPayment: Partial<PartnerPayment>): Promise<PartnerPayment | null> {
    const updatedPayment = await this.partnerPaymentModel
      .findByIdAndUpdate(id, partnerPayment, { new: true })
      .exec();
    return updatedPayment ? this.mapToDomain(updatedPayment) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.partnerPaymentModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
    return !!result;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.partnerPaymentModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.partnerPaymentModel
      .findByIdAndUpdate(id, { $unset: { deletedAt: 1 } }, { new: true })
      .exec();
    return !!result;
  }

  private mapToDomain(paymentDocument: PartnerPaymentDocument): PartnerPayment {
    return {
      id: paymentDocument._id.toString(),
      projectId: paymentDocument.projectId.toString(),
      partnerName: paymentDocument.partnerName,
      amount: paymentDocument.amount,
      currency: paymentDocument.currency,
      date: paymentDocument.date,
      paymentMethod: paymentDocument.paymentMethod,
      description: paymentDocument.description,
      createdAt: paymentDocument.createdAt,
      updatedAt: paymentDocument.updatedAt,
      deletedAt: paymentDocument.deletedAt,
    };
  }
} 