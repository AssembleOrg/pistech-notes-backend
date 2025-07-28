import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Currency, PaymentMethod } from '../../domain/types';

export class PartnerPaymentFilterDto {
  @ApiPropertyOptional({ description: 'Filter by project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Filter by partner name (partial match)' })
  @IsOptional()
  @IsString()
  partnerName?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum amount' })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum amount' })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by currency',
    enum: ['ARS', 'USD', 'EUR']
  })
  @IsOptional()
  @IsEnum(['ARS', 'USD', 'EUR'])
  currency?: Currency;

  @ApiPropertyOptional({ description: 'Filter by payment date (start)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter by payment date (end)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by payment method',
    enum: ['cash', 'transfer', 'card', 'check', 'other']
  })
  @IsOptional()
  @IsEnum(['cash', 'transfer', 'card', 'check', 'other'])
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Filter by description (partial match)' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Include deleted payments' })
  @IsOptional()
  includeDeleted?: boolean = false;
} 