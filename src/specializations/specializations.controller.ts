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
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllSpecializations);
    this.router
      .route(`${this.path}/new`)
      .post(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(CreateSpecializationDto),
        this.createSpecialization
      );
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findSpecializationById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(UpdateSpecializationDto, true),
        this.updateSpecialization
      );
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteSpecialization);
  }

  private findSpecializationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const specialization = await this.specializationsService.findSpecializationById(id);
      if (specialization) {
        return res.status(200).json(specialization);
      }
      next(new SpecializationNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private findAllSpecializations = async (req: Request, res: Response) => {
    try {
      const specializations = await this.specializationsService.findAllSpecializations();
      return res.status(200).json(specializations);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private createSpecialization = async (req: Request, res: Response) => {
    try {
      const specializationData: CreateSpecializationDto = req.body;
      const newSpecialization = await this.specializationsService.createSpecialization(
        specializationData,
        (req as RequestWithUser).user
      );
      return res.status(201).json(newSpecialization);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateSpecialization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specializationData: UpdateSpecializationDto = req.body;
      const { id } = req.params;
      const updateSpecialization = await this.specializationsService.updateSpecialization(id, specializationData);
      if (updateSpecialization) {
        return res.status(200).json(updateSpecialization);
      }
      next(new SpecializationNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteSpecialization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteSpecialization = await this.specializationsService.deleteSpecialization(id);
      if (deleteSpecialization) {
        return res.status(200).json(deleteSpecialization);
      }
      next(new SpecializationNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
