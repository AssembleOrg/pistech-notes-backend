import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { PartnerService } from '../../application/services/partner.service';
import { CreatePartnerDto, UpdatePartnerDto, PartnerResponseDto } from '../../application/dto/partner.dto';
import { PartnerFilterDto } from '../../application/dto/partner-filter.dto';
import { PartnerPaginationDto } from '../../application/dto/partner-pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';
import { LoggingService } from '../../application/services/logging.service';
import { Request } from 'express';

@ApiTags('Partners')
@Controller('partners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PartnerController { 
  constructor(
    private readonly partnerService: PartnerService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiResponse({ status: 201, description: 'Partner created successfully', type: PartnerResponseDto })
  async create(@Body() createPartnerDto: CreatePartnerDto, @Req() request: Request): Promise<PartnerResponseDto> {
    const partner = await this.partnerService.create(createPartnerDto);
    await this.loggingService.logCreate(request, 'Partner', partner.id, partner);
    return partner;
  }

  @Get()
  @ApiOperation({ summary: 'Get all partners with optional filters' })
  @ApiResponse({ status: 200, description: 'List of partners', type: [PartnerResponseDto] })
  @ApiQuery({ name: 'fullName', required: false, description: 'Filter by full name (partial match)' })
  @ApiQuery({ name: 'nickname', required: false, description: 'Filter by nickname (partial match)' })
  @ApiQuery({ name: 'number', required: false, description: 'Filter by number (partial match)' })
  @ApiQuery({ name: 'partnerRole', required: false, enum: ['owner', 'collaborator'], description: 'Filter by partner role' })
  @ApiQuery({ name: 'pistechRole', required: false, enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other'], description: 'Filter by Pistech role' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted partners' })
  async findAll(@Query() filters: PartnerFilterDto): Promise<PartnerResponseDto[]> {
    return this.partnerService.findAll(filters);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get all partners with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of partners' })
  @ApiQuery({ name: 'fullName', required: false, description: 'Filter by full name (partial match)' })
  @ApiQuery({ name: 'nickname', required: false, description: 'Filter by nickname (partial match)' })
  @ApiQuery({ name: 'number', required: false, description: 'Filter by number (partial match)' })
  @ApiQuery({ name: 'partnerRole', required: false, enum: ['owner', 'collaborator'], description: 'Filter by partner role' })
  @ApiQuery({ name: 'pistechRole', required: false, enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other'], description: 'Filter by Pistech role' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted partners' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)', example: 10 })
  async findAllPaginated(
    @Query() query: PartnerPaginationDto,
  ): Promise<PaginatedResponseDto<PartnerResponseDto>> {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    return this.partnerService.findAllPaginated(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a partner by ID' })
  @ApiResponse({ status: 200, description: 'Partner found', type: PartnerResponseDto })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async findOne(@Param('id') id: string): Promise<PartnerResponseDto> {
    return this.partnerService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a partner' })
  @ApiResponse({ status: 200, description: 'Partner updated successfully', type: PartnerResponseDto })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
    @Req() request: Request,
  ): Promise<PartnerResponseDto> {
    const oldPartner = await this.partnerService.findById(id);
    const updatedPartner = await this.partnerService.update(id, updatePartnerDto);
    await this.loggingService.logUpdate(request, 'Partner', id, oldPartner, updatedPartner);
    return updatedPartner;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a partner' })
  @ApiResponse({ status: 204, description: 'Partner soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async softDelete(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const partner = await this.partnerService.findById(id);
    await this.partnerService.softDelete(id);
    await this.loggingService.logDelete(request, 'Partner', id, partner);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a partner' })
  @ApiResponse({ status: 204, description: 'Partner hard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async hardDelete(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const partner = await this.partnerService.findById(id);
    await this.partnerService.hardDelete(id);
    await this.loggingService.logDelete(request, 'Partner', id, partner);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft deleted partner' })
  @ApiResponse({ status: 200, description: 'Partner restored successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async restore(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const oldPartner = await this.partnerService.findById(id);
    await this.partnerService.restore(id);
    const restoredPartner = await this.partnerService.findById(id);
    await this.loggingService.logUpdate(request, 'Partner', id, oldPartner, restoredPartner);
  }
} 