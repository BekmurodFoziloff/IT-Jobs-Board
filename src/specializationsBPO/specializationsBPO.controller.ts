import { Router, Request, Response, NextFunction } from 'express';
import { SpecializationsBPOService } from './specializationsBPO.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateSpecializationBPODto } from './dto/createSpecializationBPO.dto';
import { UpdateSpecializationBPODto } from './dto/updateSpecializationBPO.dto';
import SpecializationBPONotFoundException from '../exceptions/SpecializationBPONotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class SpecializationsBPOController {
  public path = '/specialization/bpo';
  public router = Router();
  private specializationsBPOService = new SpecializationsBPOService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllSpecializationsBPO);
    this.router
      .route(`${this.path}/new`)
      .post(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(CreateSpecializationBPODto),
        this.createSpecializationBPO
      );
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findSpecializationBPOById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(UpdateSpecializationBPODto, true),
        this.updateSpecializationBPO
      );
    this.router
      .route(`${this.path}/:id/delete`)
      .delete(authMiddleware, adminAuthMiddleware, this.deleteSpecializationBPO);
  }

  private findSpecializationBPOById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const specializationBPO = await this.specializationsBPOService.findSpecializationBPOById(id);
      if (specializationBPO) {
        return res.status(200).json(specializationBPO);
      }
      next(new SpecializationBPONotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllSpecializationsBPO = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const specializationsBPO = await this.specializationsBPOService.findAllSpecializationsBPO(Number(page));
      return res.status(200).json(specializationsBPO);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private createSpecializationBPO = async (req: Request, res: Response) => {
    try {
      const specializationBPOData: CreateSpecializationBPODto = req.body;
      const newSpecializationBPO = await this.specializationsBPOService.createSpecializationBPO(
        specializationBPOData,
        (req as RequestWithUser).user
      );
      return res.status(201).json(newSpecializationBPO);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateSpecializationBPO = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specializationBPOData: UpdateSpecializationBPODto = req.body;
      const { id } = req.params;
      const updateSpecializationBPO = await this.specializationsBPOService.updateSpecializationBPO(
        id,
        specializationBPOData
      );
      if (updateSpecializationBPO) {
        return res.status(200).json(updateSpecializationBPO);
      }
      next(new SpecializationBPONotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteSpecializationBPO = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteSpecializationBPO = await this.specializationsBPOService.deleteSpecializationBPO(id);
      if (deleteSpecializationBPO) {
        return res.status(200).json(deleteSpecializationBPO);
      }
      next(new SpecializationBPONotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
