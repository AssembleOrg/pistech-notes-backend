import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';
import { PARTNER_REPOSITORY } from '../../domain/repositories/tokens';
import { Partner } from '../../domain/interfaces/partner.interface';
import { CreatePartnerDto, UpdatePartnerDto } from '../dto/partner.dto';
import { PartnerFilterDto } from '../dto/partner-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Injectable()
export class PartnerService {
  constructor(
    @Inject(PARTNER_REPOSITORY)
    private readonly partnerRepository: IPartnerRepository,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    return this.partnerRepository.create(createPartnerDto);
  }

  async findAll(filters?: PartnerFilterDto): Promise<Partner[]> {
    return this.partnerRepository.findAll(filters);
  }

  async findAllPaginated(filters?: PartnerFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Partner>> {
    return this.partnerRepository.findAllPaginated(filters, pagination);
  }

  async findById(id: string, includeDeleted?: boolean): Promise<Partner> {
    const partner = await this.partnerRepository.findById(id, includeDeleted);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    const updatedPartner = await this.partnerRepository.update(id, updatePartnerDto);
    if (!updatedPartner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return updatedPartner;
  }

  async softDelete(id: string): Promise<void> {
    const deleted = await this.partnerRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
  }

  async hardDelete(id: string): Promise<void> {
    const deleted = await this.partnerRepository.hardDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.partnerRepository.restore(id);
    if (!restored) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
  }
} 