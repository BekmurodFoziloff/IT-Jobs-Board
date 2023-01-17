import { Request, Response, NextFunction } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import TokenPayload from '../interfaces/tokenPayload.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { UsersService } from '../users/users.service';

async function refreshMiddleware(req: Request, res: Response, next: NextFunction) {
  const usersService = new UsersService();
  const cookies = req.cookies;
  if (cookies && cookies.Refresh) {
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    try {
      const verificationResponse = verify(cookies.Refresh, secret as Secret) as TokenPayload;
      const id = verificationResponse.userId;
      const user = await usersService.getUserById(id);
      if (user) {
        (req as RequestWithUser).user = user;
        const isRefreshTokenMatching = await usersService.refreshTokenMatches(
          cookies.Refresh,
          user.currentHashedRefreshToken
        );
        if (isRefreshTokenMatching) {
          next();
        }
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      res.status(error.status || 500).json(error.message);
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default refreshMiddleware;
