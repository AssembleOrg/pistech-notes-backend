import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CLIENT_CHARGE_REPOSITORY } from '../../domain/repositories/tokens';
import { IClientChargeRepository } from '../../domain/repositories/client-charge.repository.interface';
import { ClientCharge } from '../../domain/interfaces/client-charge.interface';
import { CreateClientChargeDto, UpdateClientChargeDto } from '../dto/client-charge.dto';
import { ClientChargeFilterDto } from '../dto/client-charge-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Injectable()
export class ClientChargeService {
  constructor(
    @Inject(CLIENT_CHARGE_REPOSITORY)
    private readonly clientChargeRepository: IClientChargeRepository,
  ) {}

  async create(createClientChargeDto: CreateClientChargeDto): Promise<ClientCharge> {
    return this.clientChargeRepository.create(createClientChargeDto);
  }

  async findAll(filters?: ClientChargeFilterDto): Promise<ClientCharge[]> {
    return this.clientChargeRepository.findAll(filters);
  }

  async findAllPaginated(filters?: ClientChargeFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<ClientCharge>> {
    return this.clientChargeRepository.findAllPaginated(filters, pagination);
  }

  async findByProjectId(projectId: string, includeDeleted?: boolean): Promise<ClientCharge[]> {
    return this.clientChargeRepository.findByProjectId(projectId, includeDeleted);
  }

  async findById(id: string, includeDeleted?: boolean): Promise<ClientCharge> {
    const charge = await this.clientChargeRepository.findById(id, includeDeleted);
    if (!charge) {
      throw new NotFoundException(`Client charge with ID ${id} not found`);
    }
    return charge;
  }

  async update(id: string, updateClientChargeDto: UpdateClientChargeDto): Promise<ClientCharge> {
    const updatedCharge = await this.clientChargeRepository.update(id, updateClientChargeDto);
    if (!updatedCharge) {
      throw new NotFoundException(`Client charge with ID ${id} not found`);
    }
    return updatedCharge;
  }

  async softDelete(id: string): Promise<void> {
    const deleted = await this.clientChargeRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Client charge with ID ${id} not found`);
    }
  }

  async hardDelete(id: string): Promise<void> {
    const deleted = await this.clientChargeRepository.hardDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Client charge with ID ${id} not found`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.clientChargeRepository.restore(id);
    if (!restored) {
      throw new NotFoundException(`Client charge with ID ${id} not found`);
    }
  }
} 