import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/tokens';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dto/auth.dto';
import { User } from '../../domain/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateToken(token: string): Promise<User | null> {
    const decoded = this.jwtService.verify(token);
    return this.userRepository.findById(decoded.sub);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
} 