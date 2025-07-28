import { IsOptional, IsString, IsNumber, Min, Max, IsBoolean, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectPaginationDto {
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
  status?: 'active' | 'completed' | 'on-hold' | 'cancelled' | 'pending';

  @ApiPropertyOptional({ description: 'Include deleted projects' })
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