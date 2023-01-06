import jwt from 'jsonwebtoken';
import TokenPayload from '../interfaces/tokenPayload.interface';

export class AuthenticationService {
    
    public getCookieWithJwtAccessToken(userId: string) {
        const payload: TokenPayload = { userId };
        const secret = process.env.JWT_ACCESS_TOKEN_SECRET as string;
        type alphanumeric = number | string;
        const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as alphanumeric;
        const token = jwt.sign(payload, secret, { expiresIn: `${expiresIn}s` });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
    }

    public getCookieWithJwtRefreshToken(userId: string) {
        const payload: TokenPayload = { userId };
        const secret = process.env.JWT_REFRESH_TOKEN_SECRET as string;
        type alphanumeric = number | string;
        const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as alphanumeric;
        const token = jwt.sign(payload, secret, { expiresIn: `${expiresIn}s` });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
        return {
            cookie,
            token
        }
    }

    public getCookiesForLogOut() {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0'
        ];
    }
}