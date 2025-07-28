import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../../domain/types';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Project amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Project currency', enum: ['ARS', 'USD', 'EUR'] })
  @IsEnum(['ARS', 'USD', 'EUR'])
  currency: 'ARS' | 'USD' | 'EUR';

  @ApiPropertyOptional({ 
    description: 'Project status',
    enum: ['active', 'completed', 'on-hold', 'cancelled', 'pending'],
    default: 'active'
  })
  @IsOptional()
  @IsEnum(['active', 'completed', 'on-hold', 'cancelled', 'pending'])
  status?: ProjectStatus;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: 'Project name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Project status',
    enum: ['active', 'completed', 'on-hold', 'cancelled', 'pending']
  })
  @IsOptional()
  @IsEnum(['active', 'completed', 'on-hold', 'cancelled', 'pending'])
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Project amount' })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ description: 'Project currency' })
  @IsOptional()
  @IsEnum(['ARS', 'USD', 'EUR'])
  currency?: 'ARS' | 'USD' | 'EUR';

}

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ enum: ['active', 'completed', 'on-hold', 'cancelled', 'pending'] })
  status: ProjectStatus;

  @ApiPropertyOptional({ description: 'Project amount' })
  amount: number;

  @ApiPropertyOptional({ description: 'Project currency' })
  currency: 'ARS' | 'USD' | 'EUR';
} 