import { ClientCharge } from '../interfaces/client-charge.interface';
import { ClientChargeFilterDto } from '../../application/dto/client-charge-filter.dto';
import { PaginationDto } from '../../application/dto/pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';

export interface IClientChargeRepository {
  create(clientCharge: Omit<ClientCharge, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientCharge>;
  findAll(filters?: ClientChargeFilterDto): Promise<ClientCharge[]>;
  findAllPaginated(filters?: ClientChargeFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<ClientCharge>>;
  findByProjectId(projectId: string, includeDeleted?: boolean): Promise<ClientCharge[]>;
  findById(id: string, includeDeleted?: boolean): Promise<ClientCharge | null>;
  update(id: string, clientCharge: Partial<ClientCharge>): Promise<ClientCharge | null>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
} 