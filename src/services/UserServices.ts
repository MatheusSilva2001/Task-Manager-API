import { CreateUserDataType } from "../repositories/userRepository";
import { UserDataTypes } from "../validations/userSchema";
import { randomUUID } from "node:crypto";
import { hash } from "bcrypt";
import { AppError } from "../errors/appError";
import { NextFunction } from "express";

export type userRepositoryTypes = {
  create(data: CreateUserDataType): Promise<CreateUserDataType | undefined>;
  getUserByEmail(email: string): Promise<CreateUserDataType | undefined>;
  getUserById(id: string): Promise<Partial<CreateUserDataType> | undefined>;
};

export const userServices = {
  async create(
    { name, email, password }: UserDataTypes,
    repository: userRepositoryTypes
  ) {
    try {
      const user = await repository.getUserByEmail(email);

      if (user) throw new AppError("Email already exists", 400);

      const passwordHash = await hash(password, 10);
      // UUID
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

  async read(id: string, repository: userRepositoryTypes) {
    try {
      const user = await repository.getUserById(id);

      if (!user) throw new AppError("User not found", 404);

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  },
};
