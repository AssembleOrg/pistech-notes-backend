import { IsOptional, IsString, IsNumber, Min, Max, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PartnerPaymentPaginationDto {
  @ApiPropertyOptional({ description: 'Filter by project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Filter by partner name (partial match)' })
  @IsOptional()
  @IsString()
  partnerName?: string;

  @ApiPropertyOptional({ description: 'Minimum amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  maxAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by currency',
    enum: ['ARS', 'USD', 'EUR']
  })
  @IsOptional()
  @IsEnum(['ARS', 'USD', 'EUR'])
  currency?: 'ARS' | 'USD' | 'EUR';

  @ApiPropertyOptional({ description: 'Start date (ISO string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by payment method',
    enum: ['cash', 'transfer', 'card', 'check', 'other']
  })
  @IsOptional()
  @IsEnum(['cash', 'transfer', 'card', 'check', 'other'])
  paymentMethod?: 'cash' | 'transfer' | 'card' | 'check' | 'other';

  @ApiPropertyOptional({ description: 'Filter by description (partial match)' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Include deleted partner payments' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDeleted?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Page number (starts from 1)', 
    minimum: 1,
    default: 1,
    example: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page', 
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
} 