import { randomUUID } from "node:crypto";
import { AppError } from "../errors/appError";
import { TaskDataTypes } from "../validations/taskSchema";

export type CreateTaskDataTypes = TaskDataCreate & { user_id: string};

export type UserRepositoryTypes = {
  create(data: CreateUserDataType): Promise<CreateUserDataType | undefined>;
  getUserByEmail(email: string): Promise<CreateUserDataType | undefined>;
  getUserByID(id: string): Promise<Partial<CreateUserDataType> | undefined>;
};

export const userServices = {
  async create(
    { name, email, password }: UserDataTypes,
    repository: UserRepositoryTypes
  ) {
    try {
      const user = await repository.getUserByEmail(email);
      if (user) throw new AppError("email already exists", 400);

      const passwordHash = await hash(password, 10);

      const userCreated = await repository.create({
        id: randomUUID(),
        name,
        email,
        password: passwordHash,
      });

      if (!userCreated) return;
      userCreated.password = "*".repeat(userCreated.password.length);

      return userCreated;
    } catch (error) {
      throw error;
    }
  },

  async read(id: string, repository: UserRepositoryTypes) {
    try {
      const user = await repository.getUserByID(id);

      if (!user) throw new AppError("user not found", 404);

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  },
};
