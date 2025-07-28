import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  status?: 'active' | 'completed' | 'on-hold' | 'cancelled' | 'pending';

  @IsOptional()
  includeDeleted?: boolean;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
} 