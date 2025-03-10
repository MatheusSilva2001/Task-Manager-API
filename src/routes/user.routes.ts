import { Router } from "express";
import { userControllers } from "../controllers/userControllers";

export const userRoutes = Router();

userRoutes.get("/user", userControllers.read);
