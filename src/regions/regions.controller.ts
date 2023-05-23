import { Router, Request, Response, NextFunction } from 'express';
import { RegionsService } from './regions.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateRegionDto } from './dto/createRegion.dto';
import { UpdateRegionDto } from './dto/updateRegion.dto';
import RegionNotFoundException from '../exceptions/RegionNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class RegionsController {
  public path = '/region';
  public router = Router();
  private regionsService = new RegionsService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllRegions);
    this.router
      .route(`${this.path}/new`)
      .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateRegionDto), this.createRegion);
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findRegionById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateRegionDto, true), this.updateRegion);
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteRegion);
  }

  private findRegionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const region = await this.regionsService.findRegionById(id);
      if (region) {
        return res.status(200).json(region);
      }
      next(new RegionNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllRegions = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const regions = await this.regionsService.findAllRegions(Number(page));
      return res.status(200).json(regions);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private createRegion = async (req: Request, res: Response) => {
    try {
      const regionData: CreateRegionDto = req.body;
      const newRegion = await this.regionsService.createRegion(regionData, (req as RequestWithUser).user);
      return res.status(201).json(newRegion);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regionData: UpdateRegionDto = req.body;
      const { id } = req.params;
      const updateRegion = await this.regionsService.updateRegion(id, regionData);
      if (updateRegion) {
        return res.status(200).json(regionData);
      }
      next(new RegionNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteRegion = await this.regionsService.deleteRegion(id);
      if (deleteRegion) {
        return res.status(200).json(deleteRegion);
      }
      next(new RegionNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
