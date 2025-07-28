import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PARTNER_PAYMENT_REPOSITORY } from '../../domain/repositories/tokens';
import { IPartnerPaymentRepository } from '../../domain/repositories/partner-payment.repository.interface';
import { PartnerPayment } from '../../domain/interfaces/partner-payment.interface';
import { CreatePartnerPaymentDto, UpdatePartnerPaymentDto } from '../dto/partner-payment.dto';
import { PartnerPaymentFilterDto } from '../dto/partner-payment-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Injectable()
export class PartnerPaymentService {
  constructor(
    @Inject(PARTNER_PAYMENT_REPOSITORY)
    private readonly partnerPaymentRepository: IPartnerPaymentRepository,
  ) {}

  async create(createPartnerPaymentDto: CreatePartnerPaymentDto): Promise<PartnerPayment> {
    return this.partnerPaymentRepository.create(createPartnerPaymentDto);
  }

  async findAll(filters?: PartnerPaymentFilterDto): Promise<PartnerPayment[]> {
    return this.partnerPaymentRepository.findAll(filters);
  }

  async findAllPaginated(filters?: PartnerPaymentFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<PartnerPayment>> {
    return this.partnerPaymentRepository.findAllPaginated(filters, pagination);
  }

  async findByProjectId(projectId: string, includeDeleted?: boolean): Promise<PartnerPayment[]> {
    return this.partnerPaymentRepository.findByProjectId(projectId, includeDeleted);
  }

  async findById(id: string, includeDeleted?: boolean): Promise<PartnerPayment> {
    const payment = await this.partnerPaymentRepository.findById(id, includeDeleted);
    if (!payment) {
      throw new NotFoundException(`Partner payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePartnerPaymentDto: UpdatePartnerPaymentDto): Promise<PartnerPayment> {
    const updatedPayment = await this.partnerPaymentRepository.update(id, updatePartnerPaymentDto);
    if (!updatedPayment) {
      throw new NotFoundException(`Partner payment with ID ${id} not found`);
    }
    return updatedPayment;
  }

  async softDelete(id: string): Promise<void> {
    const deleted = await this.partnerPaymentRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Partner payment with ID ${id} not found`);
    }
  }

  async hardDelete(id: string): Promise<void> {
    const deleted = await this.partnerPaymentRepository.hardDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Partner payment with ID ${id} not found`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.partnerPaymentRepository.restore(id);
    if (!restored) {
      throw new NotFoundException(`Partner payment with ID ${id} not found`);
    }
  }
} 