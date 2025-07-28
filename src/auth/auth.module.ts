import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../presentation/controllers/auth.controller';
import { AuthService } from '../application/services/auth.service';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { User, UserSchema } from '../infrastructure/schemas/user.schema';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy';
import { USER_REPOSITORY } from '../domain/repositories/tokens';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') 
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {} 