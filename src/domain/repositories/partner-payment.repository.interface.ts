import { PartnerPayment } from '../interfaces/partner-payment.interface';
import { PartnerPaymentFilterDto } from '../../application/dto/partner-payment-filter.dto';
import { PaginationDto } from '../../application/dto/pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';

export interface IPartnerPaymentRepository {
  create(partnerPayment: Omit<PartnerPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<PartnerPayment>;
  findAll(filters?: PartnerPaymentFilterDto): Promise<PartnerPayment[]>;
  findAllPaginated(filters?: PartnerPaymentFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<PartnerPayment>>;
  findByProjectId(projectId: string, includeDeleted?: boolean): Promise<PartnerPayment[]>;
  findById(id: string, includeDeleted?: boolean): Promise<PartnerPayment | null>;
  update(id: string, partnerPayment: Partial<PartnerPayment>): Promise<PartnerPayment | null>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
} 