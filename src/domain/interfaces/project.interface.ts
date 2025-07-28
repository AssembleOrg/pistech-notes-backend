export interface Project {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: 'ARS' | 'USD' | 'EUR';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled' | 'pending';
} 