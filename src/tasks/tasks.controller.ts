import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { stat } from 'fs';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipes';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDTO): Promise<Task[]>{
        return this.tasksService.getTask(filterDto);
    }
        
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
       @Body() createTaskDTO: CreateTaskDTO): Promise<Task>{
        return this.tasksService.createTask(createTaskDTO);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task>{
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe )id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task>{
            return this.tasksService.updateTaskStatus(id, status)
        }
}
