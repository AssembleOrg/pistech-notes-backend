import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../../domain/types';

export class ProjectFilterDto {
  @ApiPropertyOptional({ description: 'Filter by name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by description (partial match)' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by status',
    enum: ['active', 'completed', 'on-hold', 'cancelled', 'pending']
  })
  @IsOptional()
  @IsEnum(['active', 'completed', 'on-hold', 'cancelled', 'pending'])
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Include deleted projects' })
  @IsOptional()
  includeDeleted?: boolean = false;
} 