import { NextFunction, Request, Response } from "express";
import { userServices } from "../services/UserServices";
import { userRepository } from "../repositories/userRepository";
import { UUIDSchema } from "../validations/UUIDSchema";
import { userSchema } from "../validations/userSchema";

export const userControllers = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = userSchema.parse(req.body);

      const userCreated = await userServices.create(
        { name, email, password },
        userRepository
      );

      //SOLID

      res.status(201).json(userCreated);
    } catch (error) {
      next(error);
    }
  },

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = UUIDSchema().parse(req.params);

      const user = await userServices.read(id, userRepository);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};
