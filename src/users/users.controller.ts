import { Router, Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { JobsService } from '../jobs/jobs.service';
import authMiddleware from '../middlewares/auth.middleware';
import {
    UpdateUserProfileDto,
    UpdateUserContactsDto,
    UpdateUserWorkExperienceDto,
    UpdateUserEducationDto,
    UpdateUserAchievementDto,
    UpdateUserGeneralInformationAboutTheProjectDto
} from './dto/updateUser.dto';
import { UsersService } from './users.service';
import WorkExperienceOfUserNotFoundException from '../exceptions/WorkExperienceOfUserNotFoundException';
import EducationOfUserNotFoundException from '../exceptions/EducationOfUserNotFoundException';
import AchievementOfUserNotFoundException from '../exceptions/AchievementOfUserNotFoundException';
import PortfolioOfUserNotFoundException from '../exceptions/PortfolioOfUserNotFoundException';
import ProfessionalNotFoundException from '../exceptions/ProfessionalNotFoundException';

export class UsersController {
    public path = '/my';
    public router = Router();

    constructor(
        private usersService: UsersService,
        private jobsService: JobsService
    ) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(`${this.path}/job/list`)
            .get(authMiddleware, this.getAllJobsOfUser);
        this.router.route(`${this.path}/profile/:id/edit`)
            .put(authMiddleware, this.updateUserProfile);
        this.router.route(`${this.path}/profile/contacts/:id/edit`)
            .put(authMiddleware, this.updateUserContacts);
        this.router.route(`${this.path}/profile/:id/work/new`)
            .put(authMiddleware, this.updateUserCreateWorkExperience);
        this.router.route(`${this.path}/profile/work/:id/edit`)
            .put(authMiddleware, this.updateUserUpdateWorkExperience);
        this.router.route(`${this.path}/profile/work/:id/delete`)
            .put(authMiddleware, this.updateUserDeleteWorkExperience);
        this.router.route(`${this.path}/profile/:id/education/new`)
            .put(authMiddleware, this.updateUserCreateEducation);
        this.router.route(`${this.path}/profile/education/:id/edit`)
            .put(authMiddleware, this.updateUserUpdateEducation);
        this.router.route(`${this.path}/profile/education/:id/delete`)
            .put(authMiddleware, this.updateUserDeleteEducation);
        this.router.route(`${this.path}/profile/:id/achievement/new`)
            .put(authMiddleware, this.updateUserCreateAchievement);
        this.router.route(`${this.path}/profile/achievement/:id/edit`)
            .put(authMiddleware, this.updateUserUpdateAchievement);
        this.router.route(`${this.path}/profile/achievement/:id/delete`)
            .put(authMiddleware, this.updateUserDeleteAchievement);
        this.router.route(`${this.path}/profile/:id/portfolio/new`)
            .put(authMiddleware, this.updateUserCreateGeneralInformationAboutTheProject);
        this.router.route(`${this.path}/profile/portfolio/:id/edit`)
            .put(authMiddleware, this.updateUserUpdateGeneralInformationAboutTheProject);
        this.router.route(`${this.path}/profile/portfolio/:id/delete`)
            .put(authMiddleware, this.updateUserDeleteGeneralInformationAboutTheProject);
        this.router.route(`${this.path}/profile/:id/publish`)
            .put(authMiddleware, this.publish);
        this.router.route(`${this.path}/profile/:id/publish-cancel`)
            .put(authMiddleware, this.publishCancel);
        this.router.route(`/professional/:id`)
            .get(this.findUserById);
        this.router.route(`/professional`)
            .get(this.findAllUsers);
    }

    private findUserById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const job = await this.usersService.findUserById(id);
        if (job) {
            return res.send(job);
        }
        next(new ProfessionalNotFoundException(id));
    }

    private findAllUsers = async (req: Request, res: Response) => {
        const { query } = req;
        const jobs = await this.usersService.findAllUsers(query);
        res.send(jobs);
    }

    private updateUserProfile = async (req: Request, res: Response) => {
        const userProfileData: UpdateUserProfileDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserProfile(
            id,
            userProfileData
        );
        const updateUserProfileResult = await this.usersService.getUserById(id);
        if (updateUserProfileResult) {
            return res.send(updateUserProfileResult);
        }
    }

    private updateUserContacts = async (req: Request, res: Response) => {
        const userContactsData: UpdateUserContactsDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserContacts(
            id,
            userContactsData
        );
        const updateUserProfileResult = await this.usersService.getUserById(id);
        if (updateUserProfileResult) {
            return res.send(updateUserProfileResult);
        }
    }

    private updateUserCreateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const userWorkExperience: UpdateUserWorkExperienceDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserCreateWorkExperience(
            id,
            userWorkExperience
        );
        const userNewWorkExperienceResult = await this.usersService.getUserById(id);
        if (userNewWorkExperienceResult) {
            return res.send(userNewWorkExperienceResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const userWorkExperience: UpdateUserWorkExperienceDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserUpdateWorkExperience(
            id,
            userWorkExperience
        );
        const userUpdateWorkExperienceResult = await this.usersService.getUserByWorkExperience(id);
        if (userUpdateWorkExperienceResult) {
            return res.send(userUpdateWorkExperienceResult);
        }
        next(new WorkExperienceOfUserNotFoundException(id));
    }

    private updateUserDeleteWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.usersService.updateUserDeleteWorkExperience(
            id
        );
        const userUpdateWorkExperienceResult = await this.usersService.getUserByWorkExperience(id);
        if (userUpdateWorkExperienceResult) {
            return res.send(userUpdateWorkExperienceResult);
        }
        next(new WorkExperienceOfUserNotFoundException(id));
    }

    private updateUserCreateEducation = async (req: Request, res: Response, next: NextFunction) => {
        const userEducation: UpdateUserEducationDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserCreateEducation(
            id,
            userEducation
        );
        const userNewEducationResult = await this.usersService.getUserById(id);
        if (userNewEducationResult) {
            return res.send(userNewEducationResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdateEducation = async (req: Request, res: Response, next: NextFunction) => {
        const userEducation: UpdateUserEducationDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserUpdateEducation(
            id,
            userEducation
        );
        const userUpdateEducationResult = await this.usersService.getUserByEducation(id);
        if (userUpdateEducationResult) {
            return res.send(userUpdateEducationResult);
        }
        next(new EducationOfUserNotFoundException(id));
    }

    private updateUserDeleteEducation = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.usersService.updateUserDeleteEducation(
            id
        );
        const userUpdateEducationResult = await this.usersService.getUserByEducation(id);
        if (userUpdateEducationResult) {
            return res.send(userUpdateEducationResult);
        }
        next(new EducationOfUserNotFoundException(id));
    }

    private updateUserCreateAchievement = async (req: Request, res: Response, next: NextFunction) => {
        const userAchievement: UpdateUserAchievementDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserCreateAchievement(
            id,
            userAchievement
        );
        const userNewAchievementResult = await this.usersService.getUserById(id);
        if (userNewAchievementResult) {
            return res.send(userNewAchievementResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdateAchievement = async (req: Request, res: Response, next: NextFunction) => {
        const userAchievement: UpdateUserAchievementDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserUpdateAchievement(
            id,
            userAchievement
        );
        const userUpdateAchievementResult = await this.usersService.getUserByAchievement(id);
        if (userUpdateAchievementResult) {
            return res.send(userUpdateAchievementResult);
        }
        next(new AchievementOfUserNotFoundException(id));
    }

    private updateUserDeleteAchievement = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.usersService.updateUserDeleteAchievement(
            id
        );
        const userUpdateAchievementResult = await this.usersService.getUserByAchievement(id);
        if (userUpdateAchievementResult) {
            return res.send(userUpdateAchievementResult);
        }
        next(new AchievementOfUserNotFoundException(id));
    }

    private updateUserCreateGeneralInformationAboutTheProject = async (req: Request, res: Response, next: NextFunction) => {
        const userGeneralInformationAboutTheProject: UpdateUserGeneralInformationAboutTheProjectDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserCreateGeneralInformationAboutTheProject(
            id,
            userGeneralInformationAboutTheProject
        );
        const userNewGeneralInformationAboutTheProjectResult = await this.usersService.getUserById(id);
        if (userNewGeneralInformationAboutTheProjectResult) {
            return res.send(userNewGeneralInformationAboutTheProjectResult);
        }
        next(new NotAuthorizedException());
    }

    private updateUserUpdateGeneralInformationAboutTheProject = async (req: Request, res: Response, next: NextFunction) => {
        const userGeneralInformationAboutTheProject: UpdateUserGeneralInformationAboutTheProjectDto = req.body;
        const { id } = req.params;
        await this.usersService.updateUserUpdateGeneralInformationAboutTheProject(
            id,
            userGeneralInformationAboutTheProject
        );
        const userUpdateGeneralInformationAboutTheProjectResult = await this.usersService.getUserByGeneralInformationAboutTheProject(id);
        if (userUpdateGeneralInformationAboutTheProjectResult) {
            return res.send(userUpdateGeneralInformationAboutTheProjectResult);
        }
        next(new PortfolioOfUserNotFoundException(id));
    }

    private updateUserDeleteGeneralInformationAboutTheProject = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.usersService.updateUserDeleteGeneralInformationAboutTheProject(
            id
        );
        const userUpdateGeneralInformationAboutTheProjectResult = await this.usersService.getUserByGeneralInformationAboutTheProject(id);
        if (userUpdateGeneralInformationAboutTheProjectResult) {
            return res.send(userUpdateGeneralInformationAboutTheProjectResult);
        }
        next(new PortfolioOfUserNotFoundException(id));
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.usersService.publish(id);
        const publishUserResult = await this.usersService.getUserById(id);
        if (publishUserResult) {
            return res.send(publishUserResult);
        }
        next(new NotAuthorizedException());
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.usersService.publishCancel(id);
        const publishCancelUserResult = await this.usersService.getUserById(id);
        if (publishCancelUserResult) {
            return res.send(publishCancelUserResult);
        }
        next(new NotAuthorizedException());
    }

    private getAllJobsOfUser = async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as RequestWithUser).user.id;
        const jobs = await this.jobsService.getAllJobsOfUser(userId);
        if (jobs) {
            return res.send(jobs);
        }
        next(new NotAuthorizedException());
    }
}