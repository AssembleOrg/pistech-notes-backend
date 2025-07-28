import { Injectable, Inject } from '@nestjs/common';
import { ILogRepository } from '../../domain/repositories/log.repository.interface';
import { LOG_REPOSITORY } from '../../domain/repositories/tokens';
import { Log } from '../../domain/interfaces/log.interface';
import { CreateLogDto, LogFilterDto } from '../dto/log.dto';

@Injectable()
export class LogService {
  constructor(
    @Inject(LOG_REPOSITORY)
    private readonly logRepository: ILogRepository,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<Log> {
    return this.logRepository.create(createLogDto);
  }

  async findAll(filters?: LogFilterDto): Promise<Log[]> {
    return this.logRepository.findAll(filters);
  }

  async findById(id: string): Promise<Log | null> {
    return this.logRepository.findById(id);
  }

  async findByEntityId(entityId: string): Promise<Log[]> {
    return this.logRepository.findByEntityId(entityId);
  }

  async findByUserId(userId: string): Promise<Log[]> {
    return this.logRepository.findByUserId(userId);
  }

  async findByEntityType(entityType: string): Promise<Log[]> {
    return this.logRepository.findByEntityType(entityType);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Log[]> {
    return this.logRepository.findByDateRange(startDate, endDate);
  }

  // Helper method to create logs automatically
  async logAction(
    userId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User',
    entityId: string,
    oldData?: any,
    newData?: any,
    changes?: string[],
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Log> {
    return this.logRepository.create({
      userId,
      action,
      entityType,
      entityId,
      oldData,
      newData,
      changes,
      ipAddress,
      userAgent,
    });
  }
} 