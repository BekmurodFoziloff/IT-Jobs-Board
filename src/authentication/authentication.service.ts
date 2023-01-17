import { sign, Secret, SignOptions } from 'jsonwebtoken';
import TokenPayload from '../interfaces/tokenPayload.interface';

export class AuthenticationService {
  public getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const expiresIn = { expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s` };
    const token = sign(payload, secret as Secret, expiresIn as SignOptions);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
  }

  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    const expiresIn = { expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s` };
    const token = sign(payload, secret as Secret, expiresIn as SignOptions);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return {
      cookie,
      token
    };
  }

  public getCookiesForLogOut() {
    return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }
}
