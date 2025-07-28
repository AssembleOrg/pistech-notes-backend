import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { Project } from '../../domain/interfaces/project.interface';
import { ProjectWithCharges } from '../../domain/interfaces/project-with-charges.interface';
import { Project as ProjectSchema } from '../schemas/project.schema';
import { ClientChargeDocument } from '../schemas/client-charge.schema';
import { PartnerPaymentDocument } from '../schemas/partner-payment.schema';
import { ProjectFilterDto } from '../../application/dto/project-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectModel('Project') private projectModel: Model<ProjectSchema>,
    @InjectModel('ClientCharge') private clientChargeModel: Model<ClientChargeDocument>,
    @InjectModel('PartnerPayment') private partnerPaymentModel: Model<PartnerPaymentDocument>,
  ) {}

  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const createdProject = new this.projectModel(project);
    const savedProject = await createdProject.save();
    return this.mapToDomain(savedProject);
  }

  async findAll(filters?: ProjectFilterDto): Promise<Project[]> {
    const query: any = {};

    if (filters?.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters?.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const projects = await this.projectModel.find(query).sort({ createdAt: -1 }).exec();
    return projects.map(project => this.mapToDomain(project));
  }

  async findAllPaginated(filters?: ProjectFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Project>> {
    const query: any = {};

    if (filters?.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters?.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.projectModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.projectModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: projects.map(project => this.mapToDomain(project)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string, includeDeleted?: boolean): Promise<Project | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const project = await this.projectModel.findOne(query).exec();
    return project ? this.mapToDomain(project) : null;
  }

  async findByIdWithCharges(id: string, includeDeleted?: boolean): Promise<ProjectWithCharges | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const project = await this.projectModel.findOne(query).exec();
    if (!project) return null;

    const chargeQuery: any = { projectId: id };
    const paymentQuery: any = { projectId: id };
    
    if (!includeDeleted) {
      chargeQuery.deletedAt = { $exists: false };
      paymentQuery.deletedAt = { $exists: false };
    }

    const clientCharges = await this.clientChargeModel.find(chargeQuery).exec();
    const partnerPayments = await this.partnerPaymentModel.find(paymentQuery).exec();

    const totalClientCharges = clientCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const totalPartnerPayments = partnerPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const netAmount = totalClientCharges - totalPartnerPayments;

    return {
      ...this.mapToDomain(project),
      clientCharges: clientCharges.map(charge => ({
        id: charge._id.toString(),
        projectId: charge.projectId.toString(),
        amount: charge.amount,
        currency: charge.currency,
        date: charge.date,
        paymentMethod: charge.paymentMethod,
        description: charge.description,
        createdAt: charge.createdAt,
        updatedAt: charge.updatedAt,
      })),
      partnerPayments: partnerPayments.map(payment => ({
        id: payment._id.toString(),
        projectId: payment.projectId.toString(),
        partnerName: payment.partnerName,
        amount: payment.amount,
        currency: payment.currency,
        date: payment.date,
        paymentMethod: payment.paymentMethod,
        description: payment.description,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
      totalClientCharges,
      totalPartnerPayments,
      netAmount,
    };
  }

  async update(id: string, project: Partial<Project>): Promise<Project | null> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, project, { new: true })
      .exec();
    return updatedProject ? this.mapToDomain(updatedProject) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.projectModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
    return !!result;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.projectModel
      .findByIdAndUpdate(id, { $unset: { deletedAt: 1 } }, { new: true })
      .exec();
    return !!result;
  }

  private mapToDomain(projectDocument: ProjectSchema): Project {
    return {
      id: projectDocument._id.toString(),
      name: projectDocument.name,
      description: projectDocument.description,
      amount: projectDocument.amount,
      currency: projectDocument.currency,
      status: projectDocument.status,
      createdAt: projectDocument.createdAt,
      updatedAt: projectDocument.updatedAt,
      deletedAt: projectDocument.deletedAt,
    };
  }
} 