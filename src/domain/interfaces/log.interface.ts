export interface Log {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User';
  entityId: string;
  oldData?: any;
  newData?: any;
  changes?: string[];
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
} 