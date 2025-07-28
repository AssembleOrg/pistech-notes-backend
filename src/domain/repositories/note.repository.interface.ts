import { Note } from '../interfaces/note.interface';
import { NoteFilterDto } from '../../application/dto/note-filter.dto';
import { PaginationDto } from '../../application/dto/pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';

export interface INoteRepository {
  create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;
  findAll(filters?: NoteFilterDto): Promise<Note[]>;
  findAllPaginated(filters?: NoteFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Note>>;
  findById(id: string, includeDeleted?: boolean): Promise<Note | null>;
  update(id: string, note: Partial<Note>): Promise<Note | null>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
} 