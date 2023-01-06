import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { UsersService } from '../users/users.service';
import YouAreNotAllowed from '../exceptions/YouAreNotAllowedException';

export const isCreatorUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersService = new UsersService();
        const { id } = req.params;
        const user = await usersService.getUserById(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const isCreatorWork = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersService = new UsersService();
        const { id } = req.params;
        const user = await usersService.getUserByWorkExperience(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const isCreatorEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersService = new UsersService();
        const { id } = req.params;
        const user = await usersService.getUserByEducation(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const isCreatorAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersService = new UsersService();
        const { id } = req.params;
        const user = await usersService.getUserByAchievement(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const isCreatorPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersService = new UsersService();
        const { id } = req.params;
        const user = await usersService.getUserByPortfolio(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}