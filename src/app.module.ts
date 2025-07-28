import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { NotesModule } from './notes/notes.module';
import { ProjectsModule } from './projects/projects.module';
import { ClientChargesModule } from './client-charges/client-charges.module';
import { PartnerPaymentsModule } from './partner-payments/partner-payments.module';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    NotesModule,
    ProjectsModule,
    ClientChargesModule,
    PartnerPaymentsModule,
    AuthModule,
    PartnersModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
