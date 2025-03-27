import { CreateUserDataType } from "../repositories/userRepository";
import { UserDataTypes } from "../validations/userSchema";
import { randomUUID } from "node:crypto";
import { hash } from "bcrypt";
import { AppError } from "../errors/appError";
import { Task } from "vitest";
import { TaskDataTypes } from "../validations/taskSchema";
import {
  CreateTaskDataType,
  UpdateTaskDataType,
} from "../repositories/taskRepository";
import { PaginationDataTypes } from "../validations/paginationSchema";

export type TaskDataCreate = TaskDataTypes & { user_id: string; id: string };
export type UserTaskPagination = PaginationDataTypes & { userID: string };

export type TaskRepositoryTypes = {
  createTask(data: TaskDataCreate): Promise<CreateTaskDataType | undefined>;
  getTaskByID(id: string): Promise<Partial<CreateTaskDataType> | undefined>;
  getTasks(data: UserTaskPagination): Promise<CreateTaskDataType[] | undefined>;
  updateTask(data: UpdateTaskDataType): Promise<UpdateTaskDataType | undefined>;
  deleteTaskByID(id: string): Promise<{ id: string } | undefined>;
};

export const userServices = {
  async create(
    { title, description, date, status, user_id }: TaskDataCreate,
    repository: TaskRepositoryTypes
  ) {
    try {
      if (new Date(date) < new Date())
        throw new AppError("date cannot be before the current time", 400);

      const taskCreated = await repository.createTask({
        id: randomUUID(),
        title,
        description,
        date,
        status: status || "pending",
        user_id,
      });

      if (!taskCreated) return;

      return taskCreated;
    } catch (error) {
      throw error;
    }
  },

  async read(
    { userID, limit, offset, filter }: UserTaskPagination,
    repository: TaskRepositoryTypes
  ) {
    try {
      if (!limit || !offset || !filter) {
        throw new AppError("Please inform limit, offset and filter", 404);
      }

      const userTasks = await repository.getTasks({
        userID,
        limit,
        offset,
        filter,
      });

      return userTasks;
    } catch (error) {
      throw error;
    }
  },

  async update(
    id: string,
    { title, description, date, status, user_id }: TaskDataCreate,
    repository: TaskRepositoryTypes
  ) {
    try {
      const task = await repository.getTaskByID(id);
      if (!task) throw new AppError("Task not found", 404);

      if (task.user_id != user_id) {
        throw new AppError("User not authorized to update task", 401);
      }

      const taskUpdate = await repository.updateTask({
        id,
        title,
        description,
        date,
        status: status || "pending",
        user_id,
        update_at: new Date(),
      });

      return taskUpdate;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string, user_id: string, repository: TaskRepositoryTypes) {
    try {
      const task = await repository.getTaskByID(id);
      if (!task) throw new AppError("Task not found", 404);

      if (task.user_id != user_id) {
        throw new AppError("User not authorized to delete task", 401);
      }

      const taskDelete = await repository.deleteTaskByID(id);

      return taskDelete;
    } catch (error) {
      throw error;
    }
  },
};
