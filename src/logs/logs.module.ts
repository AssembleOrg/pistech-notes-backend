import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogController } from '../presentation/controllers/log.controller';
import { LogService } from '../application/services/log.service';
import { LogRepository } from '../infrastructure/repositories/log.repository';
import { Log, LogSchema } from '../infrastructure/schemas/log.schema';
import { LOG_REPOSITORY } from '../domain/repositories/tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  controllers: [LogController],
  providers: [
    LogService,
    {
      provide: LOG_REPOSITORY,
      useClass: LogRepository,
    },
  ],
  exports: [LogService],
})
export class LogsModule {} 