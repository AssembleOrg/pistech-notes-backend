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
import { ClientChargeService } from '../../application/services/client-charge.service';
import { CreateClientChargeDto, UpdateClientChargeDto, ClientChargeResponseDto } from '../../application/dto/client-charge.dto';
import { ClientChargeFilterDto } from '../../application/dto/client-charge-filter.dto';
import { ClientChargePaginationDto } from '../../application/dto/client-charge-pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';
import { LoggingService } from '../../application/services/logging.service';
import { Request } from 'express';

@ApiTags('Client Charges')
@Controller('client-charges')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientChargeController {
  constructor(
    private readonly clientChargeService: ClientChargeService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client charge' })
  @ApiResponse({ status: 201, description: 'Client charge created successfully', type: ClientChargeResponseDto })
  async create(@Body() createClientChargeDto: CreateClientChargeDto, @Req() request: Request): Promise<ClientChargeResponseDto> {
    const clientCharge = await this.clientChargeService.create(createClientChargeDto);
    await this.loggingService.logCreate(request, 'ClientCharge', clientCharge.id, clientCharge);
    return clientCharge;
  }

  @Get()
  @ApiOperation({ summary: 'Get all client charges with optional filters' })
  @ApiResponse({ status: 200, description: 'List of client charges', type: [ClientChargeResponseDto] })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Minimum amount' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Maximum amount' })
  @ApiQuery({ name: 'currency', required: false, enum: ['ARS', 'USD', 'EUR'], description: 'Filter by currency' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiQuery({ name: 'paymentMethod', required: false, enum: ['cash', 'transfer', 'card', 'check', 'other'], description: 'Filter by payment method' })
  @ApiQuery({ name: 'description', required: false, description: 'Filter by description (partial match)' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted client charges' })
  async findAll(@Query() filters: ClientChargeFilterDto): Promise<ClientChargeResponseDto[]> {
    return this.clientChargeService.findAll(filters);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get all client charges with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of client charges' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Minimum amount' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Maximum amount' })
  @ApiQuery({ name: 'currency', required: false, enum: ['ARS', 'USD', 'EUR'], description: 'Filter by currency' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiQuery({ name: 'paymentMethod', required: false, enum: ['cash', 'transfer', 'card', 'check', 'other'], description: 'Filter by payment method' })
  @ApiQuery({ name: 'description', required: false, description: 'Filter by description (partial match)' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted client charges' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)', example: 10 })
  async findAllPaginated(
    @Query() query: ClientChargePaginationDto,
  ): Promise<PaginatedResponseDto<ClientChargeResponseDto>> {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    return this.clientChargeService.findAllPaginated(filters, pagination);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get client charges by project ID' })
  @ApiResponse({ status: 200, description: 'Client charges for project', type: [ClientChargeResponseDto] })
  async findByProjectId(@Param('projectId') projectId: string): Promise<ClientChargeResponseDto[]> {
    return this.clientChargeService.findByProjectId(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client charge by ID' })
  @ApiResponse({ status: 200, description: 'Client charge found', type: ClientChargeResponseDto })
  @ApiResponse({ status: 404, description: 'Client charge not found' })
  async findOne(@Param('id') id: string): Promise<ClientChargeResponseDto> {
    return this.clientChargeService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client charge' })
  @ApiResponse({ status: 200, description: 'Client charge updated successfully', type: ClientChargeResponseDto })
  @ApiResponse({ status: 404, description: 'Client charge not found' })
  async update(
    @Param('id') id: string,
    @Body() updateClientChargeDto: UpdateClientChargeDto,
    @Req() request: Request,
  ): Promise<ClientChargeResponseDto> {
    const clientCharge = await this.clientChargeService.update(id, updateClientChargeDto);
    await this.loggingService.logUpdate(request, 'ClientCharge', clientCharge.id, updateClientChargeDto, clientCharge);
    return clientCharge;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a client charge' })
  @ApiResponse({ status: 204, description: 'Client charge soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client charge not found' })
  async softDelete(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const clientCharge = await this.clientChargeService.findById(id);
    await this.clientChargeService.softDelete(id);
    await this.loggingService.logDelete(request, 'ClientCharge', id, clientCharge);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a client charge' })
  @ApiResponse({ status: 204, description: 'Client charge hard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client charge not found' })
  async hardDelete(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const clientCharge = await this.clientChargeService.findById(id);
    await this.clientChargeService.hardDelete(id);
    await this.loggingService.logDelete(request, 'ClientCharge', id, clientCharge);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft deleted client charge' })
  @ApiResponse({ status: 200, description: 'Client charge restored successfully' })
  @ApiResponse({ status: 404, description: 'Client charge not found' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.clientChargeService.restore(id);
  }
} 