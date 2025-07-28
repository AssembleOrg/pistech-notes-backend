import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnerPaymentController } from '../presentation/controllers/partner-payment.controller';
import { PartnerPaymentService } from '../application/services/partner-payment.service';
import { PartnerPaymentRepository } from '../infrastructure/repositories/partner-payment.repository';
import { PartnerPayment, PartnerPaymentSchema } from '../infrastructure/schemas/partner-payment.schema';
import { PARTNER_PAYMENT_REPOSITORY } from '../domain/repositories/tokens';
import { LoggingService } from '../application/services/logging.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PartnerPayment.name, schema: PartnerPaymentSchema }]),
    LogsModule,
  ],
  controllers: [PartnerPaymentController],
  providers: [
    PartnerPaymentService,
    {
      provide: PARTNER_PAYMENT_REPOSITORY,
      useClass: PartnerPaymentRepository,
    },
    LoggingService,
  ],
  exports: [PartnerPaymentService],
})
export class PartnerPaymentsModule {} 