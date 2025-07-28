export interface Partner {
  id: string;
  fullName: string;
  nickname: string;
  number: string;
  partnerRole: 'owner' | 'collaborator';
  pistechRole: 'developer' | 'designer' | 'manager' | 'rrhh' | 'accountant' | 'marketing' | 'sales' | 'other';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
} 