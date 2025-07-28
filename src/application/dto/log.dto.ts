import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogDto {
  @ApiProperty({ description: 'User ID who performed the action' })
  @IsString()
  userId: string;

  @ApiProperty({ 
    description: 'Action performed',
    enum: ['CREATE', 'UPDATE', 'DELETE']
  })
  @IsEnum(['CREATE', 'UPDATE', 'DELETE'])
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @ApiProperty({ 
    description: 'Type of entity affected',
    enum: ['Note', 'Project', 'ClientCharge', 'PartnerPayment', 'Partner', 'User']
  })
  @IsEnum(['Note', 'Project', 'ClientCharge', 'PartnerPayment', 'Partner', 'User'])
  entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User';

  @ApiProperty({ description: 'ID of the affected entity' })
  @IsString()
  entityId: string;

  @ApiPropertyOptional({ description: 'Previous data (for updates/deletes)' })
  @IsOptional()
  oldData?: any;

  @ApiPropertyOptional({ description: 'New data (for creates/updates)' })
  @IsOptional()
  newData?: any;

  @ApiPropertyOptional({ description: 'List of changed fields', type: [String] })
  @IsOptional()
  changes?: string[];

  @ApiPropertyOptional({ description: 'IP address of the user' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class LogFilterDto {
  @ApiPropertyOptional({ description: 'User ID filter' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ 
    description: 'Action filter',
    enum: ['CREATE', 'UPDATE', 'DELETE']
  })
  @IsOptional()
  @IsEnum(['CREATE', 'UPDATE', 'DELETE'])
  action?: 'CREATE' | 'UPDATE' | 'DELETE';

  @ApiPropertyOptional({ 
    description: 'Entity type filter',
    enum: ['Note', 'Project', 'ClientCharge', 'PartnerPayment', 'Partner', 'User']
  })
  @IsOptional()
  @IsEnum(['Note', 'Project', 'ClientCharge', 'PartnerPayment', 'Partner', 'User'])
  entityType?: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User';

  @ApiPropertyOptional({ description: 'Entity ID filter' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Start date filter (ISO string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (ISO string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class LogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ['CREATE', 'UPDATE', 'DELETE'] })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @ApiProperty({ enum: ['Note', 'Project', 'ClientCharge', 'PartnerPayment', 'Partner', 'User'] })
  entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User';

  @ApiProperty()
  entityId: string;

  @ApiPropertyOptional()
  oldData?: any;

  @ApiPropertyOptional()
  newData?: any;

  @ApiPropertyOptional({ type: [String] })
  changes?: string[];

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  createdAt: Date;
} 