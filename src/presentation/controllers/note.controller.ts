import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { NoteService } from '../../application/services/note.service';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto } from '../../application/dto/note.dto';
import { NoteFilterDto } from '../../application/dto/note-filter.dto';
import { NotePaginationDto } from '../../application/dto/note-pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';

@ApiTags('Notes')
@Controller('notes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully', type: NoteResponseDto })
  async create(@Body() createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    return this.noteService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes with optional filters' })
  @ApiResponse({ status: 200, description: 'List of notes', type: [NoteResponseDto] })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by title (partial match)' })
  @ApiQuery({ name: 'content', required: false, description: 'Filter by content (partial match)' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted notes' })
  async findAll(@Query() filters: NoteFilterDto): Promise<NoteResponseDto[]> {
    return this.noteService.findAll(filters);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get all notes with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of notes' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by title (partial match)' })
  @ApiQuery({ name: 'content', required: false, description: 'Filter by content (partial match)' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted notes' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)', example: 10 })
  async findAllPaginated(
    @Query() query: NotePaginationDto,
  ): Promise<PaginatedResponseDto<NoteResponseDto>> {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    return this.noteService.findAllPaginated(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiResponse({ status: 200, description: 'Note found', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async findOne(@Param('id') id: string): Promise<NoteResponseDto> {
    return this.noteService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a note' })
  @ApiResponse({ status: 204, description: 'Note soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async softDelete(@Param('id') id: string): Promise<void> {
    return this.noteService.softDelete(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a note' })
  @ApiResponse({ status: 204, description: 'Note hard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async hardDelete(@Param('id') id: string): Promise<void> {
    return this.noteService.hardDelete(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft deleted note' })
  @ApiResponse({ status: 200, description: 'Note restored successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.noteService.restore(id);
  }
} 