import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { PaginatedResult } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findAll(filterDto: FilterTaskDto): Promise<PaginatedResult<Task>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      fromDate,
      toDate,
      isActive = true,
    } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (search) {
      queryBuilder.andWhere('task.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (fromDate) {
      queryBuilder.andWhere('task.dueDate >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('task.dueDate <= :toDate', { toDate });
    }
    queryBuilder.andWhere('task.isActive = :isActive', { isActive });

    const [tasks, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, isActive: true },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    task.isActive = false;
    await this.taskRepository.save(task);
  }
}
