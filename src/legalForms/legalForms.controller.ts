import { Router, Request, Response, NextFunction } from 'express';
import { LegalFormsService } from './legalForms.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateLegalFormDto } from './dto/createLegalForm.dto';
import { UpdateLegalFormDto } from './dto/updateLegalForm.dto';
import LegalFormNotFoundException from '../exceptions/LegalFormNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class LegalFormsController {
  public path = '/legal/form';
  public router = Router();

  constructor(private legalFormsService: LegalFormsService) {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllLegalForms);
    this.router
      .route(`${this.path}/new`)
      .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateLegalFormDto), this.createLegalForm);
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findLegalFormById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(UpdateLegalFormDto, true),
        this.updateLegalForm
      );
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteLegalForm);
  }

  private findLegalFormById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const legalForm = await this.legalFormsService.findLegalFormById(id);
      if (legalForm) {
        return res.status(200).json(legalForm);
      }
      next(new LegalFormNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private findAllLegalForms = async (req: Request, res: Response) => {
    try {
      const legalForms = await this.legalFormsService.findAllLegalForms();
      return res.status(200).json(legalForms);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private createLegalForm = async (req: Request, res: Response) => {
    try {
      const legalFormData: CreateLegalFormDto = req.body;
      const newLegalForm = await this.legalFormsService.createLegalForm(legalFormData, (req as RequestWithUser).user);
      return res.status(201).json(newLegalForm);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateLegalForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const legalFormData: UpdateLegalFormDto = req.body;
      const { id } = req.params;
      const updateLegalForm = await this.legalFormsService.updateLegalForm(id, legalFormData);
      if (updateLegalForm) {
        return res.status(200).json(updateLegalForm);
      }
      next(new LegalFormNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteLegalForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteLegalForm = await this.legalFormsService.deleteLegalForm(id);
      if (deleteLegalForm) {
        return res.status(200).json(deleteLegalForm);
      }
      next(new LegalFormNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
