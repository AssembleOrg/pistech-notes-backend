import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';
import { Note } from '../../domain/interfaces/note.interface';
import { NoteDocument } from '../schemas/note.schema';
import { NoteFilterDto } from '../../application/dto/note-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class NoteRepository implements INoteRepository {
  constructor(
    @InjectModel('Note') private noteModel: Model<NoteDocument>,
  ) {}

  async create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const createdNote = new this.noteModel(note);
    const savedNote = await createdNote.save();
    return this.mapToDomain(savedNote);
  }

  async findAll(filters?: NoteFilterDto): Promise<Note[]> {
    const query: any = {};

    if (filters?.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }

    if (filters?.content) {
      query.content = { $regex: filters.content, $options: 'i' };
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const notes = await this.noteModel.find(query).sort({ createdAt: -1 }).exec();
    return notes.map(note => this.mapToDomain(note));
  }

  async findAllPaginated(filters?: NoteFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Note>> {
    const query: any = {};

    if (filters?.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }

    if (filters?.content) {
      query.content = { $regex: filters.content, $options: 'i' };
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (!filters?.includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      this.noteModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.noteModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: notes.map(note => this.mapToDomain(note)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string, includeDeleted?: boolean): Promise<Note | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }
    
    const note = await this.noteModel.findOne(query).exec();
    return note ? this.mapToDomain(note) : null;
  }

  async update(id: string, note: Partial<Note>): Promise<Note | null> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, note, { new: true })
      .exec();
    return updatedNote ? this.mapToDomain(updatedNote) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.noteModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
    return !!result;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.noteModel
      .findByIdAndUpdate(id, { $unset: { deletedAt: 1 } }, { new: true })
      .exec();
    return !!result;
  }

  private mapToDomain(noteDocument: NoteDocument): Note {
    return {
      id: noteDocument._id.toString(),
      title: noteDocument.title,
      content: noteDocument.content,
      tags: noteDocument.tags,
      createdAt: noteDocument.createdAt,
      updatedAt: noteDocument.updatedAt,
      deletedAt: noteDocument.deletedAt,
    };
  }
} 