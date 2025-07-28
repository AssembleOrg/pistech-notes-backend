import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILogRepository } from '../../domain/repositories/log.repository.interface';
import { Log } from '../../domain/interfaces/log.interface';
import { LogDocument } from '../schemas/log.schema';
import { LogFilterDto } from '../../application/dto/log.dto';

@Injectable()
export class LogRepository implements ILogRepository {
  constructor(
    @InjectModel('Log') private logModel: Model<LogDocument>,
  ) {}

  async create(log: Omit<Log, 'id' | 'createdAt'>): Promise<Log> {
    const createdLog = new this.logModel(log);
    const savedLog = await createdLog.save();
    return this.mapToDomain(savedLog);
  }

  async findAll(filters?: LogFilterDto): Promise<Log[]> {
    const query: any = {};

    if (filters?.userId) {
      query.userId = filters.userId;
    }

    if (filters?.action) {
      query.action = filters.action;
    }

    if (filters?.entityType) {
      query.entityType = filters.entityType;
    }

    if (filters?.entityId) {
      query.entityId = filters.entityId;
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    const logs = await this.logModel.find(query).sort({ createdAt: -1 }).exec();
    return logs.map(log => this.mapToDomain(log));
  }

  async findById(id: string): Promise<Log | null> {
    const log = await this.logModel.findById(id).exec();
    return log ? this.mapToDomain(log) : null;
  }

  async findByEntityId(entityId: string): Promise<Log[]> {
    const logs = await this.logModel.find({ entityId }).sort({ createdAt: -1 }).exec();
    return logs.map(log => this.mapToDomain(log));
  }

  async findByUserId(userId: string): Promise<Log[]> {
    const logs = await this.logModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return logs.map(log => this.mapToDomain(log));
  }

  async findByEntityType(entityType: string): Promise<Log[]> {
    const logs = await this.logModel.find({ entityType }).sort({ createdAt: -1 }).exec();
    return logs.map(log => this.mapToDomain(log));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Log[]> {
    const logs = await this.logModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 }).exec();
    return logs.map(log => this.mapToDomain(log));
  }

  private mapToDomain(logDocument: LogDocument): Log {
    return {
      id: logDocument._id.toString(),
      userId: logDocument.userId,
      action: logDocument.action,
      entityType: logDocument.entityType,
      entityId: logDocument.entityId,
      oldData: logDocument.oldData,
      newData: logDocument.newData,
      changes: logDocument.changes,
      ipAddress: logDocument.ipAddress,
      userAgent: logDocument.userAgent,
      createdAt: logDocument.createdAt,
    };
  }
} 