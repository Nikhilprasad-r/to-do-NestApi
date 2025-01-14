import { IsOptional, IsEnum, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from 'src/shared/enums/task-status.enum';
import { TaskPriority } from 'src/shared/enums/task-priority.enum';
import { Type } from 'class-transformer';

export class FilterTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ required: false, description: 'Filter tasks from this date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;

  @ApiProperty({ required: false, description: 'Filter tasks until this date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDate?: Date;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: number = 10;
}