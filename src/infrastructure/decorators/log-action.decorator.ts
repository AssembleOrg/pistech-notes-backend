import { SetMetadata } from '@nestjs/common';

export const LOG_ACTION_KEY = 'logAction';
export interface LogActionMetadata {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User';
}

export const LogAction = (metadata: LogActionMetadata) => SetMetadata(LOG_ACTION_KEY, metadata); 