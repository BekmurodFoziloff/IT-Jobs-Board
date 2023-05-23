import { Router, Request, Response, NextFunction } from 'express';
import { IndustriesService } from './industries.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateIndustryDto } from './dto/createIndustry.dto';
import { UpdateIndustryDto } from './dto/updateIndustry.dto';
import IndustryNotFoundException from '../exceptions/IndustryNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class IndustriesController {
  public path = '/industry';
  public router = Router();
  private industrysService = new IndustriesService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllIndustries);
    this.router
      .route(`${this.path}/new`)
      .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateIndustryDto), this.createIndustry);
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findIndustryById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateIndustryDto, true), this.updateIndustry);
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteIndustry);
  }

  private findIndustryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const industry = await this.industrysService.findIndustryById(id);
      if (industry) {
        return res.status(200).json(industry);
      }
      next(new IndustryNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllIndustries = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const industries = await this.industrysService.findAllIndustries(Number(page));
      return res.status(200).json(industries);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private createIndustry = async (req: Request, res: Response) => {
    try {
      const industryData: CreateIndustryDto = req.body;
      const newIndustry = await this.industrysService.createIndustry(industryData, (req as RequestWithUser).user);
      return res.status(201).json(newIndustry);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateIndustry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const industryData: UpdateIndustryDto = req.body;
      const { id } = req.params;
      const updateIndustry = await this.industrysService.updateIndustry(id, industryData);
      if (updateIndustry) {
        return res.status(200).json(updateIndustry);
      }
      next(new IndustryNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteIndustry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteIndustry = await this.industrysService.deleteIndustry(id);
      if (deleteIndustry) {
        return res.status(200).json(deleteIndustry);
      }
      next(new IndustryNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
