import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { UsersService } from '../users/users.service';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const usersService = new UsersService;
    const cookies = req.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_TOKEN_SECRET as string;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse.id;
            const user = await usersService.getUserById(id);
            if (user) {
                (req as RequestWithUser).user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;