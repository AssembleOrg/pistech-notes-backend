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
import { PartnerPaymentService } from '../../application/services/partner-payment.service';
import { CreatePartnerPaymentDto, UpdatePartnerPaymentDto, PartnerPaymentResponseDto } from '../../application/dto/partner-payment.dto';
import { PartnerPaymentFilterDto } from '../../application/dto/partner-payment-filter.dto';
import { PartnerPaymentPaginationDto } from '../../application/dto/partner-payment-pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';
import { LoggingService } from '../../application/services/logging.service';
import { Request } from 'express';

@ApiTags('Partner Payments')
@Controller('partner-payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PartnerPaymentController {
  constructor(private readonly partnerPaymentService: PartnerPaymentService, private readonly loggingService: LoggingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new partner payment' })
  @ApiResponse({ status: 201, description: 'Partner payment created successfully', type: PartnerPaymentResponseDto })
  async create(@Body() createPartnerPaymentDto: CreatePartnerPaymentDto, @Req() request: Request): Promise<PartnerPaymentResponseDto> {
    const partnerPayment = await this.partnerPaymentService.create(createPartnerPaymentDto);
    await this.loggingService.logCreate(request, 'PartnerPayment', partnerPayment.id, partnerPayment);
    return partnerPayment;
  }

  @Get()
  @ApiOperation({ summary: 'Get all partner payments with optional filters' })
  @ApiResponse({ status: 200, description: 'List of partner payments', type: [PartnerPaymentResponseDto] })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'partnerName', required: false, description: 'Filter by partner name (partial match)' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Minimum amount' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Maximum amount' })
  @ApiQuery({ name: 'currency', required: false, enum: ['ARS', 'USD', 'EUR'], description: 'Filter by currency' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiQuery({ name: 'paymentMethod', required: false, enum: ['cash', 'transfer', 'card', 'check', 'other'], description: 'Filter by payment method' })
  @ApiQuery({ name: 'description', required: false, description: 'Filter by description (partial match)' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted partner payments' })
  async findAll(@Query() filters: PartnerPaymentFilterDto): Promise<PartnerPaymentResponseDto[]> {
    return this.partnerPaymentService.findAll(filters);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get all partner payments with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of partner payments' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'partnerName', required: false, description: 'Filter by partner name (partial match)' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Minimum amount' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Maximum amount' })
  @ApiQuery({ name: 'currency', required: false, enum: ['ARS', 'USD', 'EUR'], description: 'Filter by currency' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiQuery({ name: 'paymentMethod', required: false, enum: ['cash', 'transfer', 'card', 'check', 'other'], description: 'Filter by payment method' })
  @ApiQuery({ name: 'description', required: false, description: 'Filter by description (partial match)' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted partner payments' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)', example: 10 })
  async findAllPaginated(
    @Query() query: PartnerPaymentPaginationDto,
  ): Promise<PaginatedResponseDto<PartnerPaymentResponseDto>> {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    return this.partnerPaymentService.findAllPaginated(filters, pagination);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get partner payments by project ID' })
  @ApiResponse({ status: 200, description: 'Partner payments for project', type: [PartnerPaymentResponseDto] })
  async findByProjectId(@Param('projectId') projectId: string): Promise<PartnerPaymentResponseDto[]> {
    return this.partnerPaymentService.findByProjectId(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a partner payment by ID' })
  @ApiResponse({ status: 200, description: 'Partner payment found', type: PartnerPaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Partner payment not found' })
  async findOne(@Param('id') id: string): Promise<PartnerPaymentResponseDto> {
    return this.partnerPaymentService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a partner payment' })
  @ApiResponse({ status: 200, description: 'Partner payment updated successfully', type: PartnerPaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Partner payment not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePartnerPaymentDto: UpdatePartnerPaymentDto,
    @Req() request: Request,
  ): Promise<PartnerPaymentResponseDto> {
    const oldData = await this.partnerPaymentService.findById(id);
    const newData = await this.partnerPaymentService.update(id, updatePartnerPaymentDto);
    await this.loggingService.logUpdate(request, 'PartnerPayment', id, oldData, newData);
    return newData;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a partner payment' })
  @ApiResponse({ status: 204, description: 'Partner payment soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Partner payment not found' })
  async softDelete(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const oldData = await this.partnerPaymentService.findById(id);
    await this.partnerPaymentService.softDelete(id);
    await this.loggingService.logDelete(request, 'PartnerPayment', id, oldData);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a partner payment' })
  @ApiResponse({ status: 204, description: 'Partner payment hard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Partner payment not found' })
  async hardDelete(@Param('id') id: string): Promise<void> {
    return this.partnerPaymentService.hardDelete(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft deleted partner payment' })
  @ApiResponse({ status: 200, description: 'Partner payment restored successfully' })
  @ApiResponse({ status: 404, description: 'Partner payment not found' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.partnerPaymentService.restore(id);
  }
} 