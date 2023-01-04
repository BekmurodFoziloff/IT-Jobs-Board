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
    public path = '/work-experience';
    public router = Router();

    constructor(private workExperiencesService: WorkExperiencesService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllWorkExperiences)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateWorkExperienceDto), this.createWorkExperience);
        this.router.route(`${this.path}/:id`)
            .get(this.findWorkExperienceById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteWorkExperience)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateWorkExperienceDto, true), this.updateWorkExperience);
    }

    private findWorkExperienceById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const workExperience = await this.workExperiencesService.findWorkExperienceById(id);
        if (workExperience) {
            return res.send(workExperience);
        }
        next(new WorkExperienceNotFoundException(id));
    }

    private findAllWorkExperiences = async (req: Request, res: Response) => {
        const workExperiences = await this.workExperiencesService.findAllWorkExperiences();
        res.send(workExperiences);
    }

    private createWorkExperience = async (req: Request, res: Response) => {
        const workExperienceData: CreateWorkExperienceDto = req.body;
        const newWorkExperienceResult = await this.workExperiencesService.createWorkExperience(
            workExperienceData,
            (req as RequestWithUser).user
        );
        res.send(newWorkExperienceResult);
    }

    private deleteWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteWorkExperienceResult = await this.workExperiencesService.deleteWorkExperience(id);
        if (deleteWorkExperienceResult) {
            return res.send(deleteWorkExperienceResult);
        }
        next(new WorkExperienceNotFoundException(id));
    }

    private updateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
        const workExperienceData: UpdateWorkExperienceDto = req.body;
        const { id } = req.params;
        const updateWorkExperienceResult = await this.workExperiencesService.updateWorkExperience(
            id,
            workExperienceData
        );
        if (updateWorkExperienceResult) {
            return res.send(updateWorkExperienceResult);
        }
        next(new WorkExperienceNotFoundException(id));
    }
}