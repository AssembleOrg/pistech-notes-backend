import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnerController } from '../presentation/controllers/partner.controller';
import { PartnerService } from '../application/services/partner.service';
import { PartnerRepository } from '../infrastructure/repositories/partner.repository';
import { Partner, PartnerSchema } from '../infrastructure/schemas/partner.schema';
import { PARTNER_REPOSITORY } from '../domain/repositories/tokens';
import { LoggingService } from '../application/services/logging.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }]),
    LogsModule,
  ],
  controllers: [PartnerController],
  providers: [
    PartnerService,
    LoggingService,
    {
      provide: PARTNER_REPOSITORY,
      useClass: PartnerRepository,
    },
  ],
  exports: [PartnerService],
})
export class PartnersModule {} 