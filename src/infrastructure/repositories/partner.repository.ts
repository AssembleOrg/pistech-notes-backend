import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';
import { Partner } from '../../domain/interfaces/partner.interface';
import { PartnerDocument } from '../schemas/partner.schema';
import { PartnerFilterDto } from '../../application/dto/partner-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class PartnerRepository implements IPartnerRepository {
  constructor(
    @InjectModel('Partner') private partnerModel: Model<PartnerDocument>,
  ) {}

  async create(partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Partner> {
    const createdPartner = new this.partnerModel(partner);
    const savedPartner = await createdPartner.save();
    return this.mapToDomain(savedPartner);
  }

  async findAll(filters?: PartnerFilterDto): Promise<Partner[]> {
    const query: any = {};

    if (filters?.fullName) {
      query.fullName = { $regex: filters.fullName, $options: 'i' };
    }

    if (filters?.nickname) {
      query.nickname = { $regex: filters.nickname, $options: 'i' };
    }

    if (filters?.number) {
      query.number = { $regex: filters.number, $options: 'i' };
    }

    if (filters?.partnerRole) {
      query.partnerRole = filters.partnerRole;
    }

    if (filters?.pistechRole) {
      query.pistechRole = filters.pistechRole;
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const partners = await this.partnerModel.find(query).sort({ createdAt: -1 }).exec();
    return partners.map(partner => this.mapToDomain(partner));
  }

  async findAllPaginated(filters?: PartnerFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Partner>> {
    const query: any = {};

    if (filters?.fullName) {
      query.fullName = { $regex: filters.fullName, $options: 'i' };
    }

    if (filters?.nickname) {
      query.nickname = { $regex: filters.nickname, $options: 'i' };
    }

    if (filters?.number) {
      query.number = { $regex: filters.number, $options: 'i' };
    }

    if (filters?.partnerRole) {
      query.partnerRole = filters.partnerRole;
    }

    if (filters?.pistechRole) {
      query.pistechRole = filters.pistechRole;
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [partners, total] = await Promise.all([
      this.partnerModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.partnerModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: partners.map(partner => this.mapToDomain(partner)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string, includeDeleted?: boolean): Promise<Partner | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const partner = await this.partnerModel.findOne(query).exec();
    return partner ? this.mapToDomain(partner) : null;
  }

  async update(id: string, partner: Partial<Partner>): Promise<Partner | null> {
    const updatedPartner = await this.partnerModel
      .findByIdAndUpdate(id, partner, { new: true })
      .exec();
    return updatedPartner ? this.mapToDomain(updatedPartner) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.partnerModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).exec();
    return !!result;
  }
  
  async hardDelete(id: string): Promise<boolean> {
    const result = await this.partnerModel.findByIdAndDelete(id).exec();
    return !!result;
  }
  
  async restore(id: string): Promise<boolean> {
    const result = await this.partnerModel
      .findByIdAndUpdate(id, { $unset: { deletedAt: 1 } }, { new: true })
      .exec();
    return !!result;
  }

  private mapToDomain(partnerDocument: PartnerDocument): Partner {
    return {
      id: partnerDocument._id.toString(),
      fullName: partnerDocument.fullName,
      nickname: partnerDocument.nickname,
      number: partnerDocument.number,
      partnerRole: partnerDocument.partnerRole,
      pistechRole: partnerDocument.pistechRole,
      createdAt: partnerDocument.createdAt,
      updatedAt: partnerDocument.updatedAt,
      deletedAt: partnerDocument.deletedAt,
    };
  }
} 