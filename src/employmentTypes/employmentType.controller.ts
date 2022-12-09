import { Router, Request, Response, NextFunction } from 'express';
import { EmploymentTypesService } from './employmentTypes.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateEmploymentTypeDto } from './dto/createEmploymentType.dto';
import { UpdateEmploymentTypeDto } from './dto/updateEmploymentType.dto';
import EmploymentTypeNotFoundException from '../exceptions/EmploymentTypeNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class EmploymentTypesController {
    public path = '/employment-type';
    public router = Router();

    constructor(private employmentTypesService: EmploymentTypesService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllEmploymentTypes)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateEmploymentTypeDto), this.createEmploymentType);
        this.router.route(`${this.path}/:id`)
            .get(this.findEmploymentTypeById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteEmploymentType)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateEmploymentTypeDto, true), this.updateEmploymentType);
    }

    private findEmploymentTypeById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const employmentType = await this.employmentTypesService.findEmploymentTypeById(id);
        if (employmentType) {
            return res.send(employmentType);
        }
        next(new EmploymentTypeNotFoundException(id));
    }

    private findAllEmploymentTypes = async (req: Request, res: Response) => {
        const employmentTypes = await this.employmentTypesService.findAllEmploymentTypes();
        res.send(employmentTypes);
    }

    private createEmploymentType = async (req: Request, res: Response) => {
        const employmentTypeData: CreateEmploymentTypeDto = req.body;
        const newEmploymentTypeResult = await this.employmentTypesService.createEmploymentType(
            employmentTypeData,
            (req as RequestWithUser).user
        );
        res.send(newEmploymentTypeResult);
    }

    private deleteEmploymentType = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteEmploymentTypeResult = await this.employmentTypesService.deleteEmploymentType(id);
        if (deleteEmploymentTypeResult) {
            return res.send(deleteEmploymentTypeResult);
        }
        next(new EmploymentTypeNotFoundException(id));
    }

    private updateEmploymentType = async (req: Request, res: Response, next: NextFunction) => {
        const employmentTypeData: UpdateEmploymentTypeDto = req.body;
        const { id } = req.params;
        await this.employmentTypesService.updateEmploymentType(
            id,
            employmentTypeData
        );
        const updateEmploymentTypeResult = await this.employmentTypesService.findEmploymentTypeById(id);
        if (updateEmploymentTypeResult) {
            return res.send(updateEmploymentTypeResult);
        }
        next(new EmploymentTypeNotFoundException(id));
    }
}