import { Router, Request, Response, NextFunction } from 'express';
import { SpecializationCategoriesService } from './specializationCategories.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateSpecializationCategoryDto } from './dto/createSpecializationCategory.dto';
import { UpdateSpecializationCategoryDto } from './dto/updateSpecializationCategory.dto';
import SpecializationCategoryNotFoundException from '../exceptions/SpecializationCategoryNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class SpecializationCategoriesController {
    public path = '/specialization-category';
    public router = Router();

    constructor(private specializationCategoriesService: SpecializationCategoriesService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllSpecializationCategories)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateSpecializationCategoryDto), this.createSpecializationCategory);
        this.router.route(`${this.path}/:id`)
            .get(this.findSpecializationCategoryById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteSpecializationCategory)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateSpecializationCategoryDto, true), this.updateSpecializationCategory);
    }

    private findSpecializationCategoryById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const specializationCategory = await this.specializationCategoriesService.findSpecializationCategoryById(id);
            if (specializationCategory) {
                return res.send(specializationCategory);
            }
            next(new SpecializationCategoryNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllSpecializationCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const specializationCategories = await this.specializationCategoriesService.findAllSpecializationCategories();
            res.send(specializationCategories);
        } catch (error) {
            next(error);
        }
    }

    private createSpecializationCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const specializationCategoryData: CreateSpecializationCategoryDto = req.body;
            const newSpecializationCategoryResult = await this.specializationCategoriesService.createSpecializationCategory(
                specializationCategoryData,
                (req as RequestWithUser).user
            );
            res.send(newSpecializationCategoryResult);
        } catch (error) {
            next(error);
        }
    }

    private deleteSpecializationCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteSpecializationCategoryResult = await this.specializationCategoriesService.deleteSpecializationCategory(id);
            if (deleteSpecializationCategoryResult) {
                return res.send(deleteSpecializationCategoryResult);
            }
            next(new SpecializationCategoryNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateSpecializationCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const specializationCategoryData: UpdateSpecializationCategoryDto = req.body;
            const { id } = req.params;
            const updateSpecializationCategoryResult = await this.specializationCategoriesService.updateSpecializationCategory(
                id,
                specializationCategoryData
            );
            if (updateSpecializationCategoryResult) {
                return res.send(updateSpecializationCategoryResult);
            }
            next(new SpecializationCategoryNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }
}