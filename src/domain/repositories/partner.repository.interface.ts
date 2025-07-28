import { Partner } from '../interfaces/partner.interface';
import { PartnerFilterDto } from '../../application/dto/partner-filter.dto';
import { PaginationDto } from '../../application/dto/pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';

export interface IPartnerRepository {
  create(partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Partner>;
  findAll(filters?: PartnerFilterDto): Promise<Partner[]>;
  findAllPaginated(filters?: PartnerFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Partner>>;
  findById(id: string, includeDeleted?: boolean): Promise<Partner | null>;
  update(id: string, partner: Partial<Partner>): Promise<Partner | null>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
} 