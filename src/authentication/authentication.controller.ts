import { Router, Request, Response, NextFunction } from 'express';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import LogInDto from './dto/logIn.dto';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';

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
            .get(this.logOut);
    }

    private register = async (req: Request, res: Response, next: NextFunction) => {
        const userData: RegisterDto = req.body;
        const hashedPassword = await this.usersService.hashPassword(userData.password);
        const getByEmailUser = await this.usersService.getUserByEmail(userData.email);
        if (getByEmailUser) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            const user = await this.usersService.createUser({
                ...userData,
                password: hashedPassword
            });
            const tokenData = await this.authenticationService.createToken(user);
            res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogIn(tokenData));
            res.send(user);
        }
    }

    private logIn = async (req: Request, res: Response, next: NextFunction) => {
        const logInData: LogInDto = req.body;
        const user = await this.usersService.getUserByEmail(logInData.email);
        if (user) {
            const isPasswordMatching = await this.usersService.verifyPassword(logInData.password, user.password);
            if (isPasswordMatching) {
                const tokenData = await this.authenticationService.createToken(user);
                res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogIn(tokenData));
                return res.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    public logOut = async (req: Request, res: Response, next: NextFunction) => {
        res
            .setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut())
            .sendStatus(200);
    }
}