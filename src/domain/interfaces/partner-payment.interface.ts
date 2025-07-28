export interface PartnerPayment {
  id: string;
  projectId: string;
  partnerName: string;
  amount: number;
  currency: 'ARS' | 'USD' | 'EUR';
  date: Date;
  paymentMethod: 'cash' | 'transfer' | 'card' | 'check' | 'other';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
} 