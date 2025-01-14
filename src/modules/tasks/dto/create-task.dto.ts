import { IsNotEmpty, IsEnum, IsDate, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import { TaskPriority } from '../../../shared/enums/task-priority.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => Date) 
  @IsDate()
  dueDate: Date;

  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
function Type(typeFunction: () => DateConstructor): PropertyDecorator {
  return Transform(({ value }) => {
    if (value instanceof Date) {
      return value;
    }
    return new Date(value);
  });
}
