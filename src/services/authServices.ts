import { compare } from "bcrypt";
import { AppError } from "../errors/appError";
import { userRepositoryTypes } from "./UserServices";
import { AuthDataTypes } from "../validations/authSchema";
import { sign } from "jsonwebtoken";

export const authServices = {
  async login(
    { email, password }: AuthDataTypes,
    repository: userRepositoryTypes
  ) {
    try {
      const user = await repository.getUserByEmail(email);

      if (!user) {
        throw new AppError("Email or password invalid", 401);
      }

      const passwordCheck = await compare(password, user.password);

      if (!passwordCheck) {
        throw new AppError("Email or password invalid", 401);
      }


      const token = sign({ id: user.id }, process.env.SECRET_TOKEN, {
        expiresIn: "1d",
      });

      return { id: user.id, token };
    } catch (error) {
      throw error;
    }
  },
};
