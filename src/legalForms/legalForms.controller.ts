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
    public path = '/legal-form';
    public router = Router();

    constructor(private legalFormsService: LegalFormsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllLegalForms)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateLegalFormDto), this.createLegalForm);
        this.router.route(`${this.path}/:id`)
            .get(this.findLegalFormById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteLegalForm)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateLegalFormDto, true), this.updateLegalForm);
    }

    private findLegalFormById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const legalForm = await this.legalFormsService.findLegalFormById(id);
            if (legalForm) {
                return res.send(legalForm);
            }
            next(new LegalFormNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllLegalForms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const legalForms = await this.legalFormsService.findAllLegalForms();
            res.send(legalForms);
        } catch (error) {
            next(error);
        }
    }

    private createLegalForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const legalFormData: CreateLegalFormDto = req.body;
            const newLegalFormResult = await this.legalFormsService.createLegalForm(
                legalFormData,
                (req as RequestWithUser).user
            );
            res.send(newLegalFormResult);
        } catch (error) {
            next(error);
        }
    }

    private deleteLegalForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteLegalFormResult = await this.legalFormsService.deleteLegalForm(id);
            if (deleteLegalFormResult) {
                return res.send(deleteLegalFormResult);
            }
            next(new LegalFormNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateLegalForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const legalFormData: UpdateLegalFormDto = req.body;
            const { id } = req.params;
            const updateLegalFormResult = await this.legalFormsService.updateLegalForm(
                id,
                legalFormData
            );
            if (updateLegalFormResult) {
                return res.send(updateLegalFormResult);
            }
            next(new LegalFormNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }
}