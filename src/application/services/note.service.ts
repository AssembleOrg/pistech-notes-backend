import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { NOTE_REPOSITORY } from '../../domain/repositories/tokens';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';
import { Note } from '../../domain/interfaces/note.interface';
import { CreateNoteDto, UpdateNoteDto } from '../dto/note.dto';
import { NoteFilterDto } from '../dto/note-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Injectable()
export class NoteService {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: INoteRepository,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.noteRepository.create(createNoteDto);
  }

  async findAll(filters?: NoteFilterDto): Promise<Note[]> {
    return this.noteRepository.findAll(filters);
  }

  async findAllPaginated(filters?: NoteFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Note>> {
    return this.noteRepository.findAllPaginated(filters, pagination);
  }

  async findById(id: string, includeDeleted?: boolean): Promise<Note> {
    const note = await this.noteRepository.findById(id, includeDeleted);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const updatedNote = await this.noteRepository.update(id, updateNoteDto);
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
  }

  async softDelete(id: string): Promise<void> {
    const deleted = await this.noteRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }

  async hardDelete(id: string): Promise<void> {
    const deleted = await this.noteRepository.hardDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.noteRepository.restore(id);
    if (!restored) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
} 