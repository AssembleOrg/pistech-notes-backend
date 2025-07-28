import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientChargeController } from '../presentation/controllers/client-charge.controller';
import { ClientChargeService } from '../application/services/client-charge.service';
import { ClientChargeRepository } from '../infrastructure/repositories/client-charge.repository';
import { ClientCharge, ClientChargeSchema } from '../infrastructure/schemas/client-charge.schema';
import { CLIENT_CHARGE_REPOSITORY } from '../domain/repositories/tokens';
import { LoggingService } from '../application/services/logging.service';
import { LogsModule } from '../logs/logs.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ClientCharge.name, schema: ClientChargeSchema }]),
    LogsModule,  
  ],
  controllers: [ClientChargeController],
  providers: [
    ClientChargeService,
    {
      provide: CLIENT_CHARGE_REPOSITORY,
      useClass: ClientChargeRepository,
    },
    LoggingService,
  ],
  exports: [ClientChargeService],
})
export class ClientChargesModule {} 