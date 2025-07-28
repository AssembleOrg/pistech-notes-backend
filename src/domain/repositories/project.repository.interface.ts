import { Project } from '../interfaces/project.interface';
import { ProjectWithCharges } from '../interfaces/project-with-charges.interface';
import { ProjectFilterDto } from '../../application/dto/project-filter.dto';
import { PaginationDto } from '../../application/dto/pagination.dto';
import { PaginatedResponseDto } from '../../application/dto/pagination.dto';

export interface IProjectRepository {
  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  findAll(filters?: ProjectFilterDto): Promise<Project[]>;
  findAllPaginated(filters?: ProjectFilterDto, pagination?: PaginationDto): Promise<PaginatedResponseDto<Project>>;
  findById(id: string, includeDeleted?: boolean): Promise<Project | null>;
  findByIdWithCharges(id: string, includeDeleted?: boolean): Promise<ProjectWithCharges | null>;
  update(id: string, project: Partial<Project>): Promise<Project | null>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
} 