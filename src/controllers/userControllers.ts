import { NextFunction, Request, Response } from "express"

export const userControllers = {
    async read(req:  Request, res: Response, next: NextFunction){
        try{
            res.status(200).json({ message: "User read" });
        } catch (error) {
            next(error);
        }

    }
}