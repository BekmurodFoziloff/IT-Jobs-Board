import { Router, Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import authMiddleware from '../middlewares/auth.middleware';
import {
    UpdateProfileDto,
    UpdateContactsDto,
    UpdateUserWorkExperienceDto,
    UpdateUserEducationDto,
    UpdateUserAchievementDto,
    UpdateUserPortfolioDto,
    ChangePassword
} from './dto/updateUser.dto';
import { UsersService } from './users.service';
import WorkExperienceOfUserNotFoundException from '../exceptions/WorkExperienceOfUserNotFoundException';
import EducationOfUserNotFoundException from '../exceptions/EducationOfUserNotFoundException';
import AchievementOfUserNotFoundException from '../exceptions/AchievementOfUserNotFoundException';
import PortfolioOfUserNotFoundException from '../exceptions/PortfolioOfUserNotFoundException';
import ProfessionalNotFoundException from '../exceptions/ProfessionalNotFoundException';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import {
    isCreatorUser,
    isCreatorWork,
    isCreatorEducation,
    isCreatorAchievement,
    isCreatorPortfolio
} from '../middlewares/isCreator.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

export class UsersController {
    public path = '/my';
    public router = Router();

    constructor(private usersService: UsersService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(`${this.path}/profile/:id/delete`)
            .delete(authMiddleware, isCreatorUser, this.deleteUser);
        this.router.route(`${this.path}/profile/:id/edit`)
            .put(authMiddleware, isCreatorUser, dtoValidationMiddleware(UpdateProfileDto, true), this.updateProfile);
        this.router.route(`${this.path}/profile/contacts/:id/edit`)
            .put(authMiddleware, isCreatorUser, dtoValidationMiddleware(UpdateProfileDto, true), this.updateContacts);
        this.router.route(`${this.path}/profile/:id/work/new`)
            .put(authMiddleware, isCreatorWork, dtoValidationMiddleware(UpdateUserWorkExperienceDto, true), this.updateUserCreateWorkExperience);
        this.router.route(`${this.path}/profile/work/:id/edit`)
            .put(authMiddleware, isCreatorWork, dtoValidationMiddleware(UpdateUserWorkExperienceDto, true), this.updateUserUpdateWorkExperience);
        this.router.route(`${this.path}/profile/work/:id/delete`)
            .put(authMiddleware, isCreatorWork, dtoValidationMiddleware(UpdateUserWorkExperienceDto, true), this.updateUserDeleteWorkExperience);
        this.router.route(`${this.path}/profile/:id/education/new`)
            .put(authMiddleware, isCreatorEducation, dtoValidationMiddleware(UpdateUserEducationDto, true), this.updateUserCreateEducation);
        this.router.route(`${this.path}/profile/education/:id/edit`)
            .put(authMiddleware, isCreatorEducation, dtoValidationMiddleware(UpdateUserEducationDto, true), this.updateUserUpdateEducation);
        this.router.route(`${this.path}/profile/education/:id/delete`)
            .put(authMiddleware, isCreatorEducation, dtoValidationMiddleware(UpdateUserEducationDto, true), this.updateUserDeleteEducation);
        this.router.route(`${this.path}/profile/:id/achievement/new`)
            .put(authMiddleware, isCreatorAchievement, dtoValidationMiddleware(UpdateUserAchievementDto, true), this.updateUserCreateAchievement);
        this.router.route(`${this.path}/profile/achievement/:id/edit`)
            .put(authMiddleware, isCreatorAchievement, dtoValidationMiddleware(UpdateUserAchievementDto, true), this.updateUserUpdateAchievement);
        this.router.route(`${this.path}/profile/achievement/:id/delete`)
            .put(authMiddleware, isCreatorAchievement, dtoValidationMiddleware(UpdateUserAchievementDto, true), this.updateUserDeleteAchievement);
        this.router.route(`${this.path}/profile/:id/portfolio/new`)
            .put(authMiddleware, isCreatorPortfolio, dtoValidationMiddleware(UpdateUserPortfolioDto, true), this.updateUserCreatePortfolio);
        this.router.route(`${this.path}/profile/portfolio/:id/edit`)
            .put(authMiddleware, isCreatorPortfolio, dtoValidationMiddleware(UpdateUserPortfolioDto, true), this.updateUserUpdatePortfolio);
        this.router.route(`${this.path}/profile/portfolio/:id/delete`)
            .put(authMiddleware, isCreatorPortfolio, dtoValidationMiddleware(UpdateUserPortfolioDto, true), this.updateUserDeletePortfolio);
        this.router.route(`${this.path}/profile/:id/publish`)
            .put(authMiddleware, isCreatorUser, this.publish);
        this.router.route(`${this.path}/profile/:id/publish-cancel`)
            .put(authMiddleware, isCreatorUser, this.publishCancel);
        this.router.route(`/professional/:id`)
            .get(this.findUserById);
        this.router.route(`/professional`)
            .get(this.findAllUsers);
        this.router.route(`/settings/change-password`)
            .post(authMiddleware, this.changePassword);
    }

    private findUserById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const user = await this.usersService.findUserById(id);
        if (user) {
            return res.send(user);
        }
        next(new ProfessionalNotFoundException(id));
    }

    private findAllUsers = async (req: Request, res: Response) => {
        const { query } = req;
        const users = await this.usersService.findAllUsers(query);
        res.send(users);
    }

    private deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteUserResult = await this.usersService.deleteUser(id);
        if (deleteUserResult) {
            return res.send(deleteUserResult);
        }
        next(new NotAuthorizedException());
    }

    private updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        const userProfileData: UpdateProfileDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateProfile(
            id,
            userProfileData
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new NotAuthorizedException());
    }

    private updateContacts = async (req: Request, res: Response, next: NextFunction) => {
        const userContactsData: UpdateContactsDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateContacts(
            id,
            userContactsData
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserCreateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const userWorkExperience: UpdateUserWorkExperienceDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserCreateWorkExperience(
            id,
            userWorkExperience
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const userWorkExperience: UpdateUserWorkExperienceDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserUpdateWorkExperience(
            id,
            userWorkExperience
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new WorkExperienceOfUserNotFoundException(id));
    }

    private updateUserDeleteWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserDeleteWorkExperience(
            id
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new WorkExperienceOfUserNotFoundException(id));
    }

    private updateUserCreateEducation = async (req: Request, res: Response, next: NextFunction) => {
        const userEducation: UpdateUserEducationDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserCreateEducation(
            id,
            userEducation
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdateEducation = async (req: Request, res: Response, next: NextFunction) => {
        const userEducation: UpdateUserEducationDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserUpdateEducation(
            id,
            userEducation
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new EducationOfUserNotFoundException(id));
    }

    private updateUserDeleteEducation = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserDeleteEducation(
            id
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new EducationOfUserNotFoundException(id));
    }

    private updateUserCreateAchievement = async (req: Request, res: Response, next: NextFunction) => {
        const userAchievement: UpdateUserAchievementDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserCreateAchievement(
            id,
            userAchievement
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdateAchievement = async (req: Request, res: Response, next: NextFunction) => {
        const userAchievement: UpdateUserAchievementDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserUpdateAchievement(
            id,
            userAchievement
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new AchievementOfUserNotFoundException(id));
    }

    private updateUserDeleteAchievement = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserDeleteAchievement(
            id
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new AchievementOfUserNotFoundException(id));
    }

    private updateUserCreatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        const userPortfolio: UpdateUserPortfolioDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserCreatePortfolio(
            id,
            userPortfolio
        );
        const userNewPortfolioResult = await this.usersService.getUserById(id);
        if (userNewPortfolioResult) {
            return res.send(userNewPortfolioResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        const userPortfolio: UpdateUserPortfolioDto = req.body;
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserUpdatePortfolio(
            id,
            userPortfolio
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new PortfolioOfUserNotFoundException(id));
    }

    private updateUserDeletePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updateUserResult = await this.usersService.updateUserDeletePortfolio(
            id
        );
        if (updateUserResult) {
            return res.send(updateUserResult);
        }
        next(new PortfolioOfUserNotFoundException(id));
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const publishUserResult = await this.usersService.publish(id);
        if (publishUserResult) {
            return res.send(publishUserResult);
        }
        next(new NotAuthorizedException());
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const publishCancelUserResult = await this.usersService.publishCancel(id);
        if (publishCancelUserResult) {
            return res.send(publishCancelUserResult);
        }
        next(new NotAuthorizedException());
    }

    private changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const passwordData: ChangePassword = req.body;
        const userId = (req as RequestWithUser).user.id;
        const user = await this.usersService.getUserById(userId);
        if (user) {
            const isPasswordMatching = await this.usersService.verifyPassword(
                passwordData.oldPassword,
                user.password
            );
            if (isPasswordMatching) {
                const hashedPassword = await this.usersService.hashPassword(passwordData.newPassword);
                const updateUserResult = await this.usersService.changePassword(user.id, hashedPassword);
                return res.send(updateUserResult)
            }
        }
        next(new NotAuthorizedException());
    }
}