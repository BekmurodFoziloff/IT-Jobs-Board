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
        try {
            const { id } = req.params;
            const employmentType = await this.employmentTypesService.findEmploymentTypeById(id);
            if (employmentType) {
                return res.send(employmentType);
            }
            next(new EmploymentTypeNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllEmploymentTypes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employmentTypes = await this.employmentTypesService.findAllEmploymentTypes();
            res.send(employmentTypes);
        } catch (error) {
            next(error);
        }
    }

    private createEmploymentType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employmentTypeData: CreateEmploymentTypeDto = req.body;
            const newEmploymentTypeResult = await this.employmentTypesService.createEmploymentType(
                employmentTypeData,
                (req as RequestWithUser).user
            );
            res.send(newEmploymentTypeResult);
        } catch (error) {
            next(error);
        }
    }

    private deleteEmploymentType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteEmploymentTypeResult = await this.employmentTypesService.deleteEmploymentType(id);
            if (deleteEmploymentTypeResult) {
                return res.send(deleteEmploymentTypeResult);
            }
            next(new EmploymentTypeNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateEmploymentType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employmentTypeData: UpdateEmploymentTypeDto = req.body;
            const { id } = req.params;
            const updateEmploymentTypeResult = await this.employmentTypesService.updateEmploymentType(
                id,
                employmentTypeData
            );
            if (updateEmploymentTypeResult) {
                return res.send(updateEmploymentTypeResult);
            }
            next(new EmploymentTypeNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }
}