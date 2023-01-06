import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import TokenPayload from '../interfaces/tokenPayload.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { UsersService } from '../users/users.service';

async function refreshMiddleware(req: Request, res: Response, next: NextFunction) {
    const usersService = new UsersService;
    const cookies = req.cookies;
    if (cookies && cookies.Refresh) {
        const secret = process.env.JWT_REFRESH_TOKEN_SECRET as string;
        try {
            const verificationResponse = jwt.verify(cookies.Refresh, secret) as TokenPayload;
            const id = verificationResponse.userId;
            const user = await usersService.getUserById(id);
            if (user) {
                (req as RequestWithUser).user = user;
                const isRefreshTokenMatching = await usersService.refreshTokenMatches(cookies.Refresh, user.currentHashedRefreshToken);
                if (isRefreshTokenMatching) {
                    next();
                }
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

export default refreshMiddleware;