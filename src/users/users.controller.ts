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
import { upload } from '../files/files.service';

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
            .put(authMiddleware, isCreatorUser, upload.single('avatar'), dtoValidationMiddleware(UpdateProfileDto, true), this.updateProfile);
        this.router.route(`${this.path}/profile/contacts/:id/edit`)
            .put(authMiddleware, isCreatorUser, dtoValidationMiddleware(UpdateProfileDto, true), this.updateContacts);
        this.router.route(`${this.path}/profile/:id/work/new`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateUserWorkExperienceDto, true), this.updateUserCreateWorkExperience);
        this.router.route(`${this.path}/profile/work/:id/edit`)
            .put(authMiddleware, isCreatorWork, dtoValidationMiddleware(UpdateUserWorkExperienceDto, true), this.updateUserUpdateWorkExperience);
        this.router.route(`${this.path}/profile/work/:id/delete`)
            .put(authMiddleware, isCreatorWork, this.updateUserDeleteWorkExperience);
        this.router.route(`${this.path}/profile/:id/education/new`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateUserEducationDto, true), this.updateUserCreateEducation);
        this.router.route(`${this.path}/profile/education/:id/edit`)
            .put(authMiddleware, isCreatorEducation, dtoValidationMiddleware(UpdateUserEducationDto, true), this.updateUserUpdateEducation);
        this.router.route(`${this.path}/profile/education/:id/delete`)
            .put(authMiddleware, isCreatorEducation, this.updateUserDeleteEducation);
        this.router.route(`${this.path}/profile/:id/achievement/new`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateUserAchievementDto, true), this.updateUserCreateAchievement);
        this.router.route(`${this.path}/profile/achievement/:id/edit`)
            .put(authMiddleware, isCreatorAchievement, dtoValidationMiddleware(UpdateUserAchievementDto, true), this.updateUserUpdateAchievement);
        this.router.route(`${this.path}/profile/achievement/:id/delete`)
            .put(authMiddleware, isCreatorAchievement, this.updateUserDeleteAchievement);
        this.router.route(`${this.path}/profile/:id/portfolio/new`)
            .put(
                authMiddleware,
                upload.fields(
                    [
                        { name: 'image', maxCount: 1 },
                        { name: 'image1', maxCount: 1 },
                        { name: 'image2', maxCount: 1 }
                    ]
                ),
                dtoValidationMiddleware(UpdateUserPortfolioDto, true),
                this.updateUserCreatePortfolio
            );
        this.router.route(`${this.path}/profile/portfolio/:id/edit`)
            .put(
                authMiddleware,
                upload.fields(
                    [
                        { name: 'image', maxCount: 1 },
                        { name: 'image1', maxCount: 1 },
                        { name: 'image2', maxCount: 1 }
                    ]
                ),
                dtoValidationMiddleware(UpdateUserPortfolioDto, true),
                this.updateUserUpdatePortfolio
            );
        this.router.route(`${this.path}/profile/portfolio/:id/delete`)
            .put(authMiddleware, isCreatorPortfolio, this.updateUserDeletePortfolio);
        this.router.route(`${this.path}/profile/:id/publish`)
            .put(authMiddleware, isCreatorUser, this.publish);
        this.router.route(`${this.path}/profile/:id/publish-cancel`)
            .put(authMiddleware, isCreatorUser, this.publishCancel);
        this.router.route(`/professional/:id`)
            .get(this.findUserById);
        this.router.route(`/professional`)
            .get(this.findAllUsers);
        this.router.route(`/settings/change-password`)
            .post(authMiddleware, dtoValidationMiddleware(ChangePassword), this.changePassword);
    }

    private findUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await this.usersService.findUserById(id);
            if (user) {
                return res.send(user);
            }
            next(new ProfessionalNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { query } = req;
            const users = await this.usersService.findAllUsers(query);
            res.send(users);
        } catch (error) {
            next(error);
        }
    }

    private deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteUserResult = await this.usersService.deleteUser(id);
            if (deleteUserResult) {
                return res.send(deleteUserResult);
            }
            next(new NotAuthorizedException());
        } catch (error) {
            next(error);
        }
    }

    private updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userProfileData: UpdateProfileDto = req.body;
            const { id } = req.params;
            const { file } = req;
            const updateUserResult = await this.usersService.updateProfile(
                id,
                userProfileData,
                file?.path
            );
            if (updateUserResult) {
                return res.send(updateUserResult);
            }
            next(new NotAuthorizedException());
        } catch (error) {
            next(error);
        }
    }

    private updateContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    private updateUserCreateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    private updateUserUpdateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    private updateUserDeleteWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const updateUserResult = await this.usersService.updateUserDeleteWorkExperience(
                id
            );
            if (updateUserResult) {
                return res.send(updateUserResult);
            }
            next(new WorkExperienceOfUserNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateUserCreateEducation = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    private updateUserUpdateEducation = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    private updateUserDeleteEducation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const updateUserResult = await this.usersService.updateUserDeleteEducation(
                id
            );
            if (updateUserResult) {
                return res.send(updateUserResult);
            }
            next(new EducationOfUserNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateUserCreateAchievement = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    private updateUserUpdateAchievement = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    private updateUserDeleteAchievement = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const updateUserResult = await this.usersService.updateUserDeleteAchievement(
                id
            );
            if (updateUserResult) {
                return res.send(updateUserResult);
            }
            next(new AchievementOfUserNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateUserCreatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPortfolio: UpdateUserPortfolioDto = req.body;
            const { id } = req.params;
            const { files } = req;
            const updateUserResult = await this.usersService.updateUserCreatePortfolio(
                id,
                userPortfolio,
                files
            );
            if (updateUserResult) {
                return res.send(updateUserResult);
            }
            next(new NotAuthorizedException());
        } catch (error) {
            next(error);
        }
    }

    private updateUserUpdatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPortfolio: UpdateUserPortfolioDto = req.body;
            const { id } = req.params;
            const { files } = req;
            const updateUserResult = await this.usersService.updateUserUpdatePortfolio(
                id,
                userPortfolio,
                files
            );
            if (updateUserResult) {
                return res.send(updateUserResult);
            }
            next(new PortfolioOfUserNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateUserDeletePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const updateUserResult = await this.usersService.updateUserDeletePortfolio(
                id
            );
            if (updateUserResult) {
                return res.send(updateUserResult);
            }
            next(new PortfolioOfUserNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const publishUserResult = await this.usersService.publish(id);
            if (publishUserResult) {
                return res.send(publishUserResult);
            }
            next(new NotAuthorizedException());
        } catch (error) {
            next(error);
        }
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const publishCancelUserResult = await this.usersService.publishCancel(id);
            if (publishCancelUserResult) {
                return res.send(publishCancelUserResult);
            }
            next(new NotAuthorizedException());
        } catch (error) {
            next(error);
        }
    }

    private changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    }
}