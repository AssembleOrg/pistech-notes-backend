import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { LogService } from '../../application/services/log.service';
import { LOG_ACTION_KEY, LogActionMetadata } from '../decorators/log-action.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logService: LogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, params, user } = request;
    const ipAddress = request.ip || request.connection.remoteAddress;
    const userAgent = request.get('User-Agent');

    // Get metadata from decorator
    const logMetadata = this.reflector.get<LogActionMetadata>(
      LOG_ACTION_KEY,
      context.getHandler(),
    );

    // If no metadata, try to determine from URL and method
    const action = logMetadata?.action || this.getActionFromMethod(method);
    const entityType = logMetadata?.entityType || this.getEntityTypeFromUrl(url);
    const entityId = params?.id || body?.id;
    const userId = (user as any)?.sub || (user as any)?.id;

    if (!action || !entityType || !userId) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          console.log(`Logging ${action} action for ${entityType} by user ${userId}`);
          
          // For CREATE actions, log the new data
          if (action === 'CREATE') {
            await this.logService.logAction(
              userId,
              action,
              entityType,
              entityId || response?.id,
              undefined,
              response,
              undefined,
              ipAddress,
              userAgent,
            );
          }
          // For UPDATE actions
          else if (action === 'UPDATE') {
            await this.logService.logAction(
              userId,
              action,
              entityType,
              entityId,
              undefined, // oldData would need to be captured before update
              response,
              this.getChangedFields(body, response),
              ipAddress,
              userAgent,
            );
          }
          // For DELETE actions
          else if (action === 'DELETE') {
            await this.logService.logAction(
              userId,
              action,
              entityType,
              entityId,
              undefined, // oldData would need to be captured before delete
              undefined,
              undefined,
              ipAddress,
              userAgent,
            );
          }
        } catch (error) {
          // Don't let logging errors break the main flow
          console.error('Logging error:', error);
        }
      }),
    );
  }

  private getActionFromMethod(method: string): 'CREATE' | 'UPDATE' | 'DELETE' | null {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PATCH':
      case 'PUT':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return null;
    }
  }

  private getEntityTypeFromUrl(url: string): 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User' | null {
    if (url.includes('/notes')) return 'Note';
    if (url.includes('/projects')) return 'Project';
    if (url.includes('/client-charges')) return 'ClientCharge';
    if (url.includes('/partner-payments')) return 'PartnerPayment';
    if (url.includes('/partners')) return 'Partner';
    if (url.includes('/users')) return 'User';
    return null;
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