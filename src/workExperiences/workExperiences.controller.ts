import { Router, Request, Response, NextFunction } from 'express';
import { WorkExperiencesService } from './workExperiences.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateWorkExperienceDto } from './dto/createWorkExperience.dto';
import { UpdateWorkExperienceDto } from './dto/updateWorkExperience.dto';
import WorkExperienceNotFoundException from '../exceptions/WorkExperienceNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class WorkExperiencesController {
  public path = '/work/experience';
  public router = Router();
  private workExperiencesService = new WorkExperiencesService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllWorkExperiences);
    this.router
      .route(`${this.path}/new`)
      .post(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(CreateWorkExperienceDto),
        this.createWorkExperience
      );
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findWorkExperienceById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(UpdateWorkExperienceDto, true),
        this.updateWorkExperience
      );
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteWorkExperience);
  }

  private findWorkExperienceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workExperience = await this.workExperiencesService.findWorkExperienceById(id);
      if (workExperience) {
        return res.status(200).json(workExperience);
      }
      next(new WorkExperienceNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllWorkExperiences = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const workExperiences = await this.workExperiencesService.findAllWorkExperiences(Number(page));
      return res.status(200).json(workExperiences);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private createWorkExperience = async (req: Request, res: Response) => {
    try {
      const workExperienceData: CreateWorkExperienceDto = req.body;
      const newWorkExperience = await this.workExperiencesService.createWorkExperience(
        workExperienceData,
        (req as RequestWithUser).user
      );
      return res.status(201).json(newWorkExperience);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workExperienceData: UpdateWorkExperienceDto = req.body;
      const { id } = req.params;
      const updateWorkExperience = await this.workExperiencesService.updateWorkExperience(id, workExperienceData);
      if (updateWorkExperience) {
        return res.status(200).json(updateWorkExperience);
      }
      next(new WorkExperienceNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteWorkExperience = await this.workExperiencesService.deleteWorkExperience(id);
      if (deleteWorkExperience) {
        return res.status(200).json(deleteWorkExperience);
      }
      next(new WorkExperienceNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
