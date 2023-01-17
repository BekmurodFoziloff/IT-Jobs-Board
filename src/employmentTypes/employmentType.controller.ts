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
  public path = '/employment/type';
  public router = Router();

  constructor(private employmentTypesService: EmploymentTypesService) {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllEmploymentTypes);
    this.router
      .route(`${this.path}/new`)
      .post(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(CreateEmploymentTypeDto),
        this.createEmploymentType
      );
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findEmploymentTypeById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(UpdateEmploymentTypeDto, true),
        this.updateEmploymentType
      );
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteEmploymentType);
  }

  private findEmploymentTypeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const employmentType = await this.employmentTypesService.findEmploymentTypeById(id);
      if (employmentType) {
        return res.status(200).json(employmentType);
      }
      next(new EmploymentTypeNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private findAllEmploymentTypes = async (req: Request, res: Response) => {
    try {
      const employmentTypes = await this.employmentTypesService.findAllEmploymentTypes();
      return res.status(200).json(employmentTypes);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private createEmploymentType = async (req: Request, res: Response) => {
    try {
      const employmentTypeData: CreateEmploymentTypeDto = req.body;
      const newEmploymentType = await this.employmentTypesService.createEmploymentType(
        employmentTypeData,
        (req as RequestWithUser).user
      );
      return res.status(201).json(newEmploymentType);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateEmploymentType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employmentTypeData: UpdateEmploymentTypeDto = req.body;
      const { id } = req.params;
      const updateEmploymentType = await this.employmentTypesService.updateEmploymentType(id, employmentTypeData);
      if (updateEmploymentType) {
        return res.status(200).json(updateEmploymentType);
      }
      next(new EmploymentTypeNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteEmploymentType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteEmploymentType = await this.employmentTypesService.deleteEmploymentType(id);
      if (deleteEmploymentType) {
        return res.status(200).json(deleteEmploymentType);
      }
      next(new EmploymentTypeNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
