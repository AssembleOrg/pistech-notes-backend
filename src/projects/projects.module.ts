import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from '../presentation/controllers/project.controller';
import { ProjectService } from '../application/services/project.service';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { Project, ProjectSchema } from '../infrastructure/schemas/project.schema';
import { ClientCharge, ClientChargeSchema } from '../infrastructure/schemas/client-charge.schema';
import { PartnerPayment, PartnerPaymentSchema } from '../infrastructure/schemas/partner-payment.schema';
import { PROJECT_REPOSITORY } from '../domain/repositories/tokens';
import { LoggingService } from '../application/services/logging.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ClientCharge.name, schema: ClientChargeSchema },
      { name: PartnerPayment.name, schema: PartnerPaymentSchema },
    ]),
    LogsModule,
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    LoggingService,
  ],
  exports: [ProjectService],
})
export class ProjectsModule {} 