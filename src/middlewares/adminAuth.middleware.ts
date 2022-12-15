import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { Roles } from '../utils/enums/role.enum';
import YouDoNotHavePermission from '../exceptions/YouDoNotHavePermission';

async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { role } = (req as RequestWithUser).user;
        if (role !== Roles.ADMIN) {
            next(new YouDoNotHavePermission());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export default adminAuthMiddleware;