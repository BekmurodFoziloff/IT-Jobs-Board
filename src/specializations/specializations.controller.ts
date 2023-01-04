import { Router, Request, Response, NextFunction } from 'express';
import { SpecializationsService } from './specializations.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateSpecializationDto } from './dto/createSpecialization.dto';
import { UpdateSpecializationDto } from './dto/updateSpecialization.dto';
import SpecializationNotFoundException from '../exceptions/SpecializationNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class SpecializationsController {
    public path = '/specialization';
    public router = Router();

    constructor(private specializationsService: SpecializationsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllSpecializations)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateSpecializationDto), this.createSpecialization);
        this.router.route(`${this.path}/:id`)
            .get(this.findSpecializationById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteSpecialization)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateSpecializationDto, true), this.updateSpecialization);
    }

    private findSpecializationById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const specialization = await this.specializationsService.findSpecializationById(id);
        if (specialization) {
            return res.send(specialization);
        }
        next(new SpecializationNotFoundException(id));
    }

    private findAllSpecializations = async (req: Request, res: Response) => {
        const specializations = await this.specializationsService.findAllSpecializations();
        res.send(specializations);
    }

    private createSpecialization = async (req: Request, res: Response) => {
        const specializationData: CreateSpecializationDto = req.body;
        const newSpecializationResult = await this.specializationsService.createSpecialization(
            specializationData,
            (req as RequestWithUser).user
        );
        res.send(newSpecializationResult);
    }

    private deleteSpecialization = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteSpecializationResult = await this.specializationsService.deleteSpecialization(id);
        if (deleteSpecializationResult) {
            return res.send(deleteSpecializationResult);
        }
        next(new SpecializationNotFoundException(id));
    }

    private updateSpecialization = async (req: Request, res: Response, next: NextFunction) => {
        const specializationData: UpdateSpecializationDto = req.body;
        const { id } = req.params;
        const updateSpecializationResult = await this.specializationsService.updateSpecialization(
            id,
            specializationData
        );
        if (updateSpecializationResult) {
            return res.send(updateSpecializationResult);
        }
        next(new SpecializationNotFoundException(id));
    }
}