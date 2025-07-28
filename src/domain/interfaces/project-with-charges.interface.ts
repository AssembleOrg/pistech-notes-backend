import { Project } from './project.interface';
import { ClientCharge } from './client-charge.interface';
import { PartnerPayment } from './partner-payment.interface';

export interface ProjectWithCharges extends Project {
  clientCharges: ClientCharge[];
  partnerPayments: PartnerPayment[];
  totalClientCharges: number;
  totalPartnerPayments: number;
  netAmount: number;
} 