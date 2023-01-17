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
import { transporter, emailConfirm, resetPassword } from '../emails/emails.service';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import ResetPassword from '../users/dto/resetPassword.dto';

export class AuthenticationController {
  public path = '/auth';
  public router = Router();

  constructor(private authenticationService: AuthenticationService, private usersService: UsersService) {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}/register`).post(dtoValidationMiddleware(RegisterDto), this.register);
    this.router.route(`${this.path}/login`).post(dtoValidationMiddleware(LogInDto), this.logIn);
    this.router.route(`${this.path}/logout`).get(authMiddleware, this.logOut);
    this.router.route(`${this.path}/refresh`).get(refreshMiddleware, this.refresh);
    this.router.route(`/activate/:token`).get(this.emailConfirm);
    this.router.route(`/reset/password`).put(this.resetPassword);
    this.router
      .route(`/reset/password/:token`)
      .put(dtoValidationMiddleware(ResetPassword, true), this.resetPasswordConfirm);
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: RegisterDto = req.body;
      const candidate = await this.usersService.getUserByEmail(userData.email);
      if (candidate) {
        next(new UserWithThatEmailAlreadyExistsException(userData.email));
      } else {
        const hashedPassword = await this.usersService.hashPassword(userData.password);
        const emailConfirmToken = await this.usersService.createConfirmToken();
        const user = await this.usersService.createUser({
          ...userData,
          password: hashedPassword,
          emailConfirmToken,
          emailConfirmTokenExpire: Date.now() + 60 * 60 * 24 * 5 * 1000
        });
        await transporter.sendMail(await emailConfirm(user.email, emailConfirmToken, user.firstName, user.lastName));
        return res.status(201).json(user);
      }
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private emailConfirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const candidate = await this.usersService.getUserByEmailConfirmToken(token);
      if (candidate && candidate.isActive === false) {
        await this.usersService.removeEmailConfirmTokenAndExpire(candidate.id);
        const user = await this.usersService.activate(candidate.id);
        return res.status(200).json(user);
      }
      next(new AuthenticationTokenMissingException());
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logInData: LogInDto = req.body;
      const candidate = await this.usersService.getUserByEmail(logInData.email);
      if (candidate && candidate.isActive === true) {
        const isPasswordMatching = await this.usersService.verifyPassword(logInData.password, candidate.password);
        if (isPasswordMatching) {
          const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(candidate.id);
          const { cookie: refreshTokenCookie, token: refreshToken } =
            this.authenticationService.getCookieWithJwtRefreshToken(candidate.id);
          const user = await this.usersService.setCurrentRefreshToken(refreshToken, candidate.id);
          res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
          return res.status(200).json(user);
        } else {
          next(new WrongCredentialsException());
        }
      } else {
        next(new WrongCredentialsException());
      }
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private logOut = async (req: Request, res: Response) => {
    try {
      const { user } = req as RequestWithUser;
      const candidate = await this.usersService.removeCurrentRefreshToken(user.id);
      const cookiesForLogOut = this.authenticationService.getCookiesForLogOut();
      res.setHeader('Set-Cookie', cookiesForLogOut);
      return res.status(200).json(candidate);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private refresh = async (req: Request, res: Response) => {
    try {
      const { user } = req as RequestWithUser;
      const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
      res.setHeader('Set-Cookie', accessTokenCookie);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const candidate = await this.usersService.getUserByEmail(email);
      if (candidate && candidate.isActive === true) {
        const resetPasswordConfirmToken = await this.usersService.createConfirmToken();
        const resetPasswordConfirmTokenExpire = Date.now() + 60 * 60 * 5 * 1000;
        const user = await this.usersService.setResetPasswordConfirmTokenAndExpire(
          candidate.id,
          resetPasswordConfirmToken,
          resetPasswordConfirmTokenExpire
        );
        await transporter.sendMail(
          await resetPassword(candidate.email, resetPasswordConfirmToken, candidate.firstName, candidate.lastName)
        );
        return res.status(200).json(user);
      }
      next(new WrongCredentialsException());
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private resetPasswordConfirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const resetPasswordData: ResetPassword = req.body;
      const candidate = await this.usersService.getUserByResetPasswordConfirmToken(token);
      if (candidate && candidate.isActive === true) {
        await this.usersService.removeResetPasswordConfirmTokenAndExpire(candidate.id);
        const hashedPassword = await this.usersService.hashPassword(resetPasswordData.newPassword);
        const user = await this.usersService.changePassword(candidate.id, hashedPassword);
        return res.status(200).json(user);
      }
      next(new AuthenticationTokenMissingException());
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
