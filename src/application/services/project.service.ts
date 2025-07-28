import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY } from '../../domain/repositories/tokens';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { Project } from '../../domain/interfaces/project.interface';
import { ProjectWithCharges } from '../../domain/interfaces/project-with-charges.interface';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { ProjectFilterDto } from '../dto/project-filter.dto';
import { PaginationDto, PaginatedResponseDto } from '../dto/pagination.dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const projectData = {
      ...createProjectDto,
      status: createProjectDto.status || 'active',
    };
    return this.projectRepository.create(projectData);
  }

  async findAll(filters?: ProjectFilterDto): Promise<Project[]> {
    return this.projectRepository.findAll(filters);
  }

  async findAllPaginated(filters?: ProjectFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Project>> {
    return this.projectRepository.findAllPaginated(filters, pagination);
  }

  async findById(id: string, includeDeleted?: boolean): Promise<Project> {
    const project = await this.projectRepository.findById(id, includeDeleted);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async findByIdWithCharges(id: string, includeDeleted?: boolean): Promise<ProjectWithCharges> {
    const project = await this.projectRepository.findByIdWithCharges(id, includeDeleted);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const updatedProject = await this.projectRepository.update(id, updateProjectDto);
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return updatedProject;
  }

  async softDelete(id: string): Promise<void> {
    const deleted = await this.projectRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async hardDelete(id: string): Promise<void> {
    const deleted = await this.projectRepository.hardDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async restore(id: string): Promise<void> {
    const restored = await this.projectRepository.restore(id);
    if (!restored) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
} 