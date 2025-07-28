import { IsEmail, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/types';

export class LoginDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ 
    description: 'User role',
    enum: ['admin', 'user'],
    default: 'user'
  })
  @IsEnum(['admin', 'user'])
  role: Role;
}

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    role: Role;
  };
} 