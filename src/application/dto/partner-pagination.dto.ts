import { IsOptional, IsString, IsNumber, Min, Max, IsBoolean, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PartnerPaginationDto {
  @ApiPropertyOptional({ description: 'Filter by full name (partial match)' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Filter by nickname (partial match)' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: 'Filter by number (partial match)' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by partner role',
    enum: ['owner', 'collaborator']
  })
  @IsOptional()
  @IsEnum(['owner', 'collaborator'])
  partnerRole?: 'owner' | 'collaborator';

  @ApiPropertyOptional({ 
    description: 'Filter by Pistech role',
    enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other']
  })
  @IsOptional()
  @IsEnum(['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other'])
  pistechRole?: 'developer' | 'designer' | 'manager' | 'rrhh' | 'accountant' | 'marketing' | 'sales' | 'other';

  @ApiPropertyOptional({ description: 'Include deleted partners' })
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