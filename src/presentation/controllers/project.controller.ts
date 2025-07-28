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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { ProjectService } from '../../application/services/project.service';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from '../../application/dto/project.dto';
import { ProjectWithCharges } from '../../domain/interfaces/project-with-charges.interface';
import { ProjectFilterDto } from '../../application/dto/project-filter.dto';
import { ProjectPaginationDto } from '../../application/dto/project-pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';
import { LoggingService } from '../../application/services/logging.service';
import { Request } from 'express';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService, private readonly loggingService: LoggingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully', type: ProjectResponseDto })
  async create(@Body() createProjectDto: CreateProjectDto, @Req() request: Request): Promise<ProjectResponseDto> {
    const project = await this.projectService.create(createProjectDto);
    await this.loggingService.logCreate(request, 'Project', project.id, project);
    return project;
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with optional filters' })
  @ApiResponse({ status: 200, description: 'List of projects', type: [ProjectResponseDto] })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name (partial match)' })
  @ApiQuery({ name: 'description', required: false, description: 'Filter by description (partial match)' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'completed', 'on-hold', 'cancelled', 'pending'], description: 'Filter by status' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted projects' })
  async findAll(@Query() filters: ProjectFilterDto): Promise<ProjectResponseDto[]> {
    return this.projectService.findAll(filters);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get all projects with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of projects' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name (partial match)' })
  @ApiQuery({ name: 'description', required: false, description: 'Filter by description (partial match)' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'completed', 'on-hold', 'cancelled', 'pending'], description: 'Filter by status' })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'Include deleted projects' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)', example: 10 })
  async findAllPaginated(
    @Query() query: ProjectPaginationDto,
  ): Promise<PaginatedResponseDto<ProjectResponseDto>> {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    return this.projectService.findAllPaginated(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project found', type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectService.findById(id);
  }

  @Get(':id/with-charges')
  @ApiOperation({ summary: 'Get a project with charges and payments' })
  @ApiResponse({ status: 200, description: 'Project with charges found' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOneWithCharges(@Param('id') id: string): Promise<ProjectWithCharges> {
    return this.projectService.findByIdWithCharges(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully', type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: Request,
  ): Promise<ProjectResponseDto> {
    const oldData = await this.projectService.findById(id);
    const newData = await this.projectService.update(id, updateProjectDto);
    await this.loggingService.logUpdate(request, 'Project', id, oldData, newData);
    return newData;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a project' })
  @ApiResponse({ status: 204, description: 'Project soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async softDelete(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const oldData = await this.projectService.findById(id);
    await this.projectService.softDelete(id);
    await this.loggingService.logDelete(request, 'Project', id, oldData);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a project' })
  @ApiResponse({ status: 204, description: 'Project hard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async hardDelete(@Param('id') id: string): Promise<void> {
    return this.projectService.hardDelete(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft deleted project' })
  @ApiResponse({ status: 200, description: 'Project restored successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async restore(@Param('id') id: string, @Req() request: Request): Promise<void> {
    return this.projectService.restore(id);
  }
} 