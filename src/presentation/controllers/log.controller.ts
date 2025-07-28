import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { LogService } from '../../application/services/log.service';
import { LogFilterDto, LogResponseDto } from '../../application/dto/log.dto';

@ApiTags('Logs')
@Controller('logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all logs with optional filters' })
  @ApiResponse({ status: 200, description: 'List of logs', type: [LogResponseDto] })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'action', required: false, enum: ['CREATE', 'UPDATE', 'DELETE'], description: 'Filter by action' })
  @ApiQuery({ name: 'entityType', required: false, enum: ['Note', 'Project', 'ClientCharge', 'PartnerPayment', 'Partner', 'User'], description: 'Filter by entity type' })
  @ApiQuery({ name: 'entityId', required: false, description: 'Filter by entity ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (ISO string)' })
  async findAll(@Query() filters: LogFilterDto): Promise<LogResponseDto[]> {
    return this.logService.findAll(filters);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint to verify logging system' })
  @ApiResponse({ status: 200, description: 'Test log created' })
  async testLogging(): Promise<{ message: string; logId: string }> {
    const testLog = await this.logService.logAction(
      'test-user-id',
      'CREATE',
      'Partner',
      'test-entity-id',
      undefined,
      { test: 'data' },
      undefined,
      '127.0.0.1',
      'Test User Agent',
    );
    
    return {
      message: 'Test log created successfully',
      logId: testLog.id,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a log by ID' })
  @ApiResponse({ status: 200, description: 'Log found', type: LogResponseDto })
  @ApiResponse({ status: 404, description: 'Log not found' })
  async findOne(@Param('id') id: string): Promise<LogResponseDto | null> {
    return this.logService.findById(id);
  }

  @Get('entity/:entityId')
  @ApiOperation({ summary: 'Get logs by entity ID' })
  @ApiResponse({ status: 200, description: 'Logs found', type: [LogResponseDto] })
  async findByEntityId(@Param('entityId') entityId: string): Promise<LogResponseDto[]> {
    return this.logService.findByEntityId(entityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get logs by user ID' })
  @ApiResponse({ status: 200, description: 'Logs found', type: [LogResponseDto] })
  async findByUserId(@Param('userId') userId: string): Promise<LogResponseDto[]> {
    return this.logService.findByUserId(userId);
  }

  @Get('type/:entityType')
  @ApiOperation({ summary: 'Get logs by entity type' })
  @ApiResponse({ status: 200, description: 'Logs found', type: [LogResponseDto] })
  async findByEntityType(@Param('entityType') entityType: string): Promise<LogResponseDto[]> {
    return this.logService.findByEntityType(entityType);
  }
} 