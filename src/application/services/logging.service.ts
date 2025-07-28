import { Injectable, Inject } from '@nestjs/common';
import { LogService } from './log.service';
import { Request } from 'express';

@Injectable()
export class LoggingService {
  constructor(private readonly logService: LogService) {}

  async logCreate(
    request: Request,
    entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User',
    entityId: string,
    newData: any,
  ): Promise<void> {
    try {
      const userId = (request.user as any)?.sub || (request.user as any)?.id;
      const ipAddress = request.ip || request.connection.remoteAddress;
      const userAgent = request.get('User-Agent');

      if (userId) {
        await this.logService.logAction(
          userId,
          'CREATE',
          entityType,
          entityId,
          undefined,
          newData,
          undefined,
          ipAddress,
          userAgent,
        );
        console.log(`Logged CREATE action for ${entityType} ${entityId} by user ${userId}`);
      }
    } catch (error) {
      console.error('Logging error:', error);
    }
  }

  async logUpdate(
    request: Request,
    entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User',
    entityId: string,
    oldData: any,
    newData: any,
  ): Promise<void> {
    try {
      const userId = (request.user as any)?.sub || (request.user as any)?.id;
      const ipAddress = request.ip || request.connection.remoteAddress;
      const userAgent = request.get('User-Agent');

      if (userId) {
        const changes = this.getChangedFields(oldData, newData);
        await this.logService.logAction(
          userId,
          'UPDATE',
          entityType,
          entityId,
          oldData,
          newData,
          changes,
          ipAddress,
          userAgent,
        );
        console.log(`Logged UPDATE action for ${entityType} ${entityId} by user ${userId}`);
      }
    } catch (error) {
      console.error('Logging error:', error);
    }
  }

  async logDelete(
    request: Request,
    entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User',
    entityId: string,
    oldData?: any,
  ): Promise<void> {
    try {
      const userId = (request.user as any)?.sub || (request.user as any)?.id;
      const ipAddress = request.ip || request.connection.remoteAddress;
      const userAgent = request.get('User-Agent');

      if (userId) {
        await this.logService.logAction(
          userId,
          'DELETE',
          entityType,
          entityId,
          oldData,
          undefined,
          undefined,
          ipAddress,
          userAgent,
        );
        console.log(`Logged DELETE action for ${entityType} ${entityId} by user ${userId}`);
      }
    } catch (error) {
      console.error('Logging error:', error);
    }
  }

  private getChangedFields(oldData: any, newData: any): string[] {
    if (!oldData || !newData) return [];
    
    const changes: string[] = [];
    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        changes.push(key);
      }
    }
    return changes;
  }
} 