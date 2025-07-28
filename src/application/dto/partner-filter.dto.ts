import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartnerRole, PistechRole } from '../../domain/types';

export class PartnerFilterDto {
  @ApiPropertyOptional({ description: 'Filter by full name (partial match)' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Filter by nickname (partial match)' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: 'Filter by phone number (partial match)' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by partner role',
    enum: ['owner', 'collaborator']
  })
  @IsOptional()
  @IsEnum(['owner', 'collaborator'])
  partnerRole?: PartnerRole;

  @ApiPropertyOptional({ 
    description: 'Filter by Pistech role',
    enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other']
  })
  @IsOptional()
  @IsEnum(['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other'])
  pistechRole?: PistechRole;

  @ApiPropertyOptional({ description: 'Include deleted partners' })
  @IsOptional()
  includeDeleted?: boolean = false;
} 