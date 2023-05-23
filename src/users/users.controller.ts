import { Router, Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import authMiddleware from '../middlewares/auth.middleware';
import UpdateProfileDto from './dto/updateProfile.dto';
import UpdateContactsDto from './dto/updateContacts.dto';
import UpdateUserEducationDto from './dto/updateUserEducation.dto';
import UpdateUserWorkExperienceDto from './dto/updateUserWorkExperience.dto';
import UpdateUserAchievementDto from './dto/updateUserAchievement.dto';
import UpdateUserPortfolioDto from './dto/updateUserPortfolio.dto';
import ChangePassword from './dto/changePassword.dto';
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
import { FilesService } from '../files/files.service';

export class UsersController {
  public path = '/my';
  public router = Router();
  private usersService = new UsersService();
  private filesService = new FilesService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}/profile/:id/delete`).delete(authMiddleware, isCreatorUser, this.deleteUser);
    this.router
      .route(`${this.path}/profile/:id/edit`)
      .put(
        authMiddleware,
        isCreatorUser,
        this.filesService.upload.single('avatar'),
        dtoValidationMiddleware(UpdateProfileDto, true),
        this.updateProfile
      );
    this.router
      .route(`${this.path}/profile/contacts/:id/edit`)
      .put(authMiddleware, isCreatorUser, dtoValidationMiddleware(UpdateProfileDto, true), this.updateContacts);
    this.router
      .route(`${this.path}/profile/:id/work/new`)
      .put(
        authMiddleware,
        dtoValidationMiddleware(UpdateUserWorkExperienceDto, true),
        this.updateUserCreateWorkExperience
      );
    this.router
      .route(`${this.path}/profile/work/:id/edit`)
      .put(
        authMiddleware,
        isCreatorWork,
        dtoValidationMiddleware(UpdateUserWorkExperienceDto, true),
        this.updateUserUpdateWorkExperience
      );
    this.router
      .route(`${this.path}/profile/work/:id/delete`)
      .put(authMiddleware, isCreatorWork, this.updateUserDeleteWorkExperience);
    this.router
      .route(`${this.path}/profile/:id/education/new`)
      .put(authMiddleware, dtoValidationMiddleware(UpdateUserEducationDto, true), this.updateUserCreateEducation);
    this.router
      .route(`${this.path}/profile/education/:id/edit`)
      .put(
        authMiddleware,
        isCreatorEducation,
        dtoValidationMiddleware(UpdateUserEducationDto, true),
        this.updateUserUpdateEducation
      );
    this.router
      .route(`${this.path}/profile/education/:id/delete`)
      .put(authMiddleware, isCreatorEducation, this.updateUserDeleteEducation);
    this.router
      .route(`${this.path}/profile/:id/achievement/new`)
      .put(authMiddleware, dtoValidationMiddleware(UpdateUserAchievementDto, true), this.updateUserCreateAchievement);
    this.router
      .route(`${this.path}/profile/achievement/:id/edit`)
      .put(
        authMiddleware,
        isCreatorAchievement,
        dtoValidationMiddleware(UpdateUserAchievementDto, true),
        this.updateUserUpdateAchievement
      );
    this.router
      .route(`${this.path}/profile/achievement/:id/delete`)
      .put(authMiddleware, isCreatorAchievement, this.updateUserDeleteAchievement);
    this.router.route(`${this.path}/profile/:id/portfolio/new`).put(
      authMiddleware,
      this.filesService.upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 }
      ]),
      dtoValidationMiddleware(UpdateUserPortfolioDto, true),
      this.updateUserCreatePortfolio
    );
    this.router.route(`${this.path}/profile/portfolio/:id/edit`).put(
      authMiddleware,
      this.filesService.upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 }
      ]),
      dtoValidationMiddleware(UpdateUserPortfolioDto, true),
      this.updateUserUpdatePortfolio
    );
    this.router
      .route(`${this.path}/profile/portfolio/:id/delete`)
      .put(authMiddleware, isCreatorPortfolio, this.updateUserDeletePortfolio);
    this.router.route(`${this.path}/profile/:id/publish`).put(authMiddleware, isCreatorUser, this.publish);
    this.router.route(`${this.path}/profile/:id/publish/cancel`).put(authMiddleware, isCreatorUser, this.publishCancel);
    this.router.route(`/professional/:id`).get(this.findUserById);
    this.router.route(`/professional`).get(this.findAllUsers);
    this.router
      .route(`/settings/change/password`)
      .post(authMiddleware, dtoValidationMiddleware(ChangePassword), this.changePassword);
  }

  private findUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.usersService.findUserById(id);
      if (user) {
        return res.status(200).json(user);
      }
      next(new ProfessionalNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllUsers = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const users = await this.usersService.findAllUsers(query);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profileData: UpdateProfileDto = req.body;
      const { id } = req.params;
      const { file } = req;
      const updateUser = await this.usersService.updateProfile(id, profileData, file?.path);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteUser = await this.usersService.deleteUser(id);
      if (deleteUser) {
        return res.status(200).json(deleteUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactsData: UpdateContactsDto = req.body;
      const { id } = req.params;
      const updateUser = await this.usersService.updateContacts(id, contactsData);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserCreateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workExperienceData: UpdateUserWorkExperienceDto = req.body;
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserCreateWorkExperience(id, workExperienceData);
      if (updateUser) {
        return res.status(201).json(updateUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserUpdateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workExperienceData: UpdateUserWorkExperienceDto = req.body;
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserUpdateWorkExperience(id, workExperienceData);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new WorkExperienceOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserDeleteWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserDeleteWorkExperience(id);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new WorkExperienceOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserCreateEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationData: UpdateUserEducationDto = req.body;
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserCreateEducation(id, educationData);
      if (updateUser) {
        return res.status(201).json(updateUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserUpdateEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationData: UpdateUserEducationDto = req.body;
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserUpdateEducation(id, educationData);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new EducationOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserDeleteEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserDeleteEducation(id);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new EducationOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserCreateAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const achievementData: UpdateUserAchievementDto = req.body;
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserCreateAchievement(id, achievementData);
      if (updateUser) {
        return res.status(201).json(updateUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserUpdateAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const achievementData: UpdateUserAchievementDto = req.body;
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserUpdateAchievement(id, achievementData);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new AchievementOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserDeleteAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserDeleteAchievement(id);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new AchievementOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserCreatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const portfolioData: UpdateUserPortfolioDto = req.body;
      const { id } = req.params;
      const { files } = req;
      const updateUser = await this.usersService.updateUserCreatePortfolio(id, portfolioData, files);
      if (updateUser) {
        return res.status(201).json(updateUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserUpdatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const portfolioData: UpdateUserPortfolioDto = req.body;
      const { id } = req.params;
      const { files } = req;
      const updateUser = await this.usersService.updateUserUpdatePortfolio(id, portfolioData, files);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new PortfolioOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateUserDeletePortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateUser = await this.usersService.updateUserDeletePortfolio(id);
      if (updateUser) {
        return res.status(200).json(updateUser);
      }
      next(new PortfolioOfUserNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishUser = await this.usersService.publish(id);
      if (publishUser) {
        return res.status(200).json(publishUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishCancelUser = await this.usersService.publishCancel(id);
      if (publishCancelUser) {
        return res.status(200).json(publishCancelUser);
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const passwordData: ChangePassword = req.body;
      const userId = (req as RequestWithUser).user.id;
      const user = await this.usersService.getUserById(userId);
      if (user) {
        const isPasswordMatching = await this.usersService.verifyPassword(passwordData.oldPassword, user.password);
        if (isPasswordMatching) {
          const hashedPassword = await this.usersService.hashPassword(passwordData.newPassword);
          const updateUser = await this.usersService.changePassword(user.id, hashedPassword);
          return res.status(200).json(updateUser);
        }
      }
      next(new NotAuthorizedException());
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
