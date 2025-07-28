import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartnerRole, PistechRole } from '../../domain/types';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Partner full name' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Partner nickname' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: 'Partner phone number' })
  @IsString()
  number: string;

  @ApiProperty({ 
    description: 'Partner role in the company',
    enum: ['owner', 'collaborator']
  })
  @IsEnum(['owner', 'collaborator'])
  partnerRole: PartnerRole;

  @ApiProperty({ 
    description: 'Pistech role',
    enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other']
  })
  @IsEnum(['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other'])
  pistechRole: PistechRole;
}

export class UpdatePartnerDto {
  @ApiPropertyOptional({ description: 'Partner full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Partner nickname' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: 'Partner phone number' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({ 
    description: 'Partner role in the company',
    enum: ['owner', 'collaborator']
  })
  @IsOptional()
  @IsEnum(['owner', 'collaborator'])
  partnerRole?: PartnerRole;

  @ApiPropertyOptional({ 
    description: 'Pistech role',
    enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other']
  })
  @IsOptional()
  @IsEnum(['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other'])
  pistechRole?: PistechRole;
}

export class PartnerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  number: string;

  @ApiProperty({ enum: ['owner', 'collaborator'] })
  partnerRole: PartnerRole;

  @ApiProperty({ enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other'] })
  pistechRole: PistechRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 