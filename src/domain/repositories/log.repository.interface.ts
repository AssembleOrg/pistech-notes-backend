import { Log } from '../interfaces/log.interface';
import { LogFilterDto } from '../../application/dto/log.dto';

export interface ILogRepository {
  create(log: Omit<Log, 'id' | 'createdAt'>): Promise<Log>;
  findAll(filters?: LogFilterDto): Promise<Log[]>;
  findById(id: string): Promise<Log | null>;
  findByEntityId(entityId: string): Promise<Log[]>;
  findByUserId(userId: string): Promise<Log[]>;
  findByEntityType(entityType: string): Promise<Log[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Log[]>;
} 