import { Router, Request, Response, NextFunction } from 'express';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import LogInDto from './dto/logIn.dto';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middlewares/auth.middleware';
import refreshMiddleware from '../middlewares/refresh.middleware';

export class AuthenticationController {
    public path = '/auth';
    public router = Router();

    constructor(
        private authenticationService: AuthenticationService,
        private usersService: UsersService
    ) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(`${this.path}/register`)
            .post(dtoValidationMiddleware(RegisterDto), this.register);
        this.router.route(`${this.path}/login`)
            .post(dtoValidationMiddleware(LogInDto), this.logIn);
        this.router.route(`${this.path}/logout`)
            .get(authMiddleware, this.logOut);
        this.router.route(`${this.path}/refresh`)
            .get(refreshMiddleware, this.refresh);
    }

    private register = async (req: Request, res: Response, next: NextFunction) => {
        const userData: RegisterDto = req.body;
        const getUserByEmail = await this.usersService.getUserByEmail(userData.email);
        const hashedPassword = await this.usersService.hashPassword(userData.password);
        if (getUserByEmail) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            const user = await this.usersService.createUser({
                ...userData,
                password: hashedPassword
            });
            res.send(user);
        }
    }

    private logIn = async (req: Request, res: Response, next: NextFunction) => {
        const logInData: LogInDto = req.body;
        const user = await this.usersService.getUserByEmail(logInData.email);
        if (user) {
            const isPasswordMatching = await this.usersService.verifyPassword(logInData.password, user.password);
            if (isPasswordMatching) {
                const accessTokenCookie = await this.authenticationService.getCookieWithJwtAccessToken(user.id);
                const {
                    cookie: refreshTokenCookie,
                    token: refreshToken
                } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
                await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
                res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
                return res.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    private logOut = async (req: Request, res: Response, next: NextFunction) => {
        const { user } = (req as RequestWithUser);
        await this.usersService.removeCurrentRefreshToken(user.id);
        res
            .setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut())
            .sendStatus(200);
    }

    private refresh = async (req: Request, res: Response, next: NextFunction) => {
        const { user } = (req as RequestWithUser);
        const accessTokenCookie = await this.authenticationService.getCookieWithJwtAccessToken(user.id);
        res
            .setHeader('Set-Cookie', accessTokenCookie)
            .sendStatus(200);
    }
}