import jwt from 'jsonwebtoken';
import TokenData from '../interfaces/tokenData.interface';
import { User } from '../users/user.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';

export class AuthenticationService {
    public async createToken(user: User): Promise<TokenData> {
        const expiresIn = process.env.JWT_TOKEN_EXPIRATSION_TIME as string;
        const secret = process.env.JWT_TOKEN_SECRET as string;
        const dataStoredInToken: DataStoredInToken = {
            id: user.id,
        };
        const token = jwt.sign(dataStoredInToken, secret, { expiresIn });
        return {
            expiresIn,
            token
        }
    }

    public getCookieForLogIn(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn}`;
    }

    public getCookieForLogOut() {
        return `Authorization=; HttpOnly; Path=/; Max-Age=0`;
    }
}