import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteController } from '../presentation/controllers/note.controller';
import { NoteService } from '../application/services/note.service';
import { NoteRepository } from '../infrastructure/repositories/note.repository';
import { Note, NoteSchema } from '../infrastructure/schemas/note.schema';
import { NOTE_REPOSITORY } from '../domain/repositories/tokens';
import { LoggingService } from '../application/services/logging.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    LogsModule,
  ],
  controllers: [NoteController],
  providers: [
    NoteService,
    {
      provide: NOTE_REPOSITORY,
      useClass: NoteRepository,
    },
    LoggingService,
  ],
  exports: [NoteService],
})
export class NotesModule {} 