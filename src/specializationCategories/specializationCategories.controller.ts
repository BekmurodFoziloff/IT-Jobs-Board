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
  public path = '/specialization/category';
  public router = Router();
  private specializationCategoriesService = new SpecializationCategoriesService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllSpecializationCategories);
    this.router
      .route(`${this.path}/new`)
      .post(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(CreateSpecializationCategoryDto),
        this.createSpecializationCategory
      );
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findSpecializationCategoryById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(UpdateSpecializationCategoryDto, true),
        this.updateSpecializationCategory
      );
    this.router
      .route(`${this.path}/:id/delete`)
      .delete(authMiddleware, adminAuthMiddleware, this.deleteSpecializationCategory);
  }

  private findSpecializationCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const specializationCategory = await this.specializationCategoriesService.findSpecializationCategoryById(id);
      if (specializationCategory) {
        return res.status(200).json(specializationCategory);
      }
      next(new SpecializationCategoryNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllSpecializationCategories = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const specializationCategories = await this.specializationCategoriesService.findAllSpecializationCategories(
        Number(page)
      );
      return res.status(200).json(specializationCategories);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private createSpecializationCategory = async (req: Request, res: Response) => {
    try {
      const specializationCategoryData: CreateSpecializationCategoryDto = req.body;
      const newSpecializationCategory = await this.specializationCategoriesService.createSpecializationCategory(
        specializationCategoryData,
        (req as RequestWithUser).user
      );
      return res.status(201).json(newSpecializationCategory);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateSpecializationCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specializationCategoryData: UpdateSpecializationCategoryDto = req.body;
      const { id } = req.params;
      const updateSpecializationCategory = await this.specializationCategoriesService.updateSpecializationCategory(
        id,
        specializationCategoryData
      );
      if (updateSpecializationCategory) {
        return res.status(200).json(updateSpecializationCategory);
      }
      next(new SpecializationCategoryNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteSpecializationCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteSpecializationCategory = await this.specializationCategoriesService.deleteSpecializationCategory(id);
      if (deleteSpecializationCategory) {
        return res.status(200).json(deleteSpecializationCategory);
      }
      next(new SpecializationCategoryNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
