import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}
    // getAllTasks(): Task[]{
    //     return this.tasks;
    // }

    // getTasksWithFilter(filterDto: GetTasksFilterDTO): Task[]{
    //     const {status, search} = filterDto;

    //     let tasks = this.getAllTasks();

    //     if(status){
    //         tasks = tasks.filter(task => task.status === status);
    //     }

    //     if(search){
    //         tasks = tasks.filter(
    //             task => 
    //             task.title.includes(search) || 
    //             task.description.includes(search),);
    //     }
    //     return tasks;
    // }

    async getTaskById(id: number): Promise<Task>{
        const found = await this.taskRepository.findOne(id);

        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    async createTask(createTaskDTO: CreateTaskDTO): Promise<Task>{
        return this.taskRepository.createTask(createTaskDTO);
    }

    async deleteTask(id: number) : Promise<void>{
      const result = await this.taskRepository.delete(id);
      if(result.affected === 0){
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task>{
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    async getTask(filterDTO: GetTasksFilterDTO): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDTO);
    }
  
}
