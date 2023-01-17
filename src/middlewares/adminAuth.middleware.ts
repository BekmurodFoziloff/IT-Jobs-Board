import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { Roles } from '../utils/enums/role.enum';
import YouDoNotHavePermissionException from '../exceptions/YouDoNotHavePermissionException';

async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = (req as RequestWithUser).user;
    if (role !== Roles.ADMIN) {
      next(new YouDoNotHavePermissionException());
    }
    next();
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
}

export default adminAuthMiddleware;
