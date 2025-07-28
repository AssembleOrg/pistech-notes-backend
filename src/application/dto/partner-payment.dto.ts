import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency, PaymentMethod } from '../../domain/types';

export class CreatePartnerPaymentDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Partner name' })
  @IsString()
  partnerName: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ 
    description: 'Currency',
    enum: ['ARS', 'USD', 'EUR']
  })
  @IsEnum(['ARS', 'USD', 'EUR'])
  currency: Currency;

  @ApiProperty({ description: 'Payment date' })
  @IsDateString()
  date: Date;

  @ApiProperty({ 
    description: 'Payment method',
    enum: ['cash', 'transfer', 'card', 'check', 'other']
  })
  @IsEnum(['cash', 'transfer', 'card', 'check', 'other'])
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ description: 'Payment description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePartnerPaymentDto {
  @ApiPropertyOptional({ description: 'Project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Partner name' })
  @IsOptional()
  @IsString()
  partnerName?: string;

  @ApiPropertyOptional({ description: 'Payment amount' })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ 
    description: 'Currency',
    enum: ['ARS', 'USD', 'EUR']
  })
  @IsOptional()
  @IsEnum(['ARS', 'USD', 'EUR'])
  currency?: Currency;

  @ApiPropertyOptional({ description: 'Payment date' })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiPropertyOptional({ 
    description: 'Payment method',
    enum: ['cash', 'transfer', 'card', 'check', 'other']
  })
  @IsOptional()
  @IsEnum(['cash', 'transfer', 'card', 'check', 'other'])
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Payment description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class PartnerPaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  partnerName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: ['ARS', 'USD', 'EUR'] })
  currency: Currency;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: ['cash', 'transfer', 'card', 'check', 'other'] })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 