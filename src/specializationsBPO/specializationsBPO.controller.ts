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
    public path = '/specialization-bpo';
    public router = Router();

    constructor(private specializationsBPOService: SpecializationsBPOService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllSpecializationsBPO)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateSpecializationBPODto), this.createSpecializationBPO);
        this.router.route(`${this.path}/:id`)
            .get(this.findSpecializationBPOById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteSpecializationBPO)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateSpecializationBPODto, true), this.updateSpecializationBPO);
    }

    private findSpecializationBPOById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const specializationBPO = await this.specializationsBPOService.findSpecializationBPOById(id);
        if (specializationBPO) {
            return res.send(specializationBPO);
        }
        next(new SpecializationBPONotFoundException(id));
    }

    private findAllSpecializationsBPO = async (req: Request, res: Response) => {
        const specializationsBPO = await this.specializationsBPOService.findAllSpecializationsBPO();
        res.send(specializationsBPO);
    }

    private createSpecializationBPO = async (req: Request, res: Response) => {
        const specializationBPOData: CreateSpecializationBPODto = req.body;
        const newSpecializationBPOResult = await this.specializationsBPOService.createSpecializationBPO(
            specializationBPOData,
            (req as RequestWithUser).user
        );
        res.send(newSpecializationBPOResult);
    }

    private deleteSpecializationBPO = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteSpecializationBPOResult = await this.specializationsBPOService.deleteSpecializationBPO(id);
        if (deleteSpecializationBPOResult) {
            return res.send(deleteSpecializationBPOResult);
        }
        next(new SpecializationBPONotFoundException(id));
    }

    private updateSpecializationBPO = async (req: Request, res: Response, next: NextFunction) => {
        const specializationBPOData: UpdateSpecializationBPODto = req.body;
        const { id } = req.params;
        await this.specializationsBPOService.updateSpecializationBPO(
            id,
            specializationBPOData
        );
        const updateSpecializationBPOResult = await this.specializationsBPOService.findSpecializationBPOById(id);
        if (updateSpecializationBPOResult) {
            return res.send(updateSpecializationBPOResult);
        }
        next(new SpecializationBPONotFoundException(id));
    }
}