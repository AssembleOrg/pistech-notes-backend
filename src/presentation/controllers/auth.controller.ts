import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from '../../application/dto/auth.dto';
import { User } from '../../domain/interfaces/user.interface';

@ApiTags('Authentication')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//   @Post('register')
//   @ApiOperation({ summary: 'Register a new user' })
//   @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
//   @ApiResponse({ status: 409, description: 'User already exists' })
//   async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
//     return this.authService.register(registerDto);
//   }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate token' })
  @ApiResponse({ status: 200, description: 'Token validated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async validateToken(@Body() body: {token: string}): Promise<User | null> {
    const {token: tokenBody} = body;
    return this.authService.validateToken(tokenBody);
  }

} 