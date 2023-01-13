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

    constructor(private regionsService: RegionsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllRegions)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateRegionDto), this.createRegion);
        this.router.route(`${this.path}/:id`)
            .get(this.findRegionById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteRegion)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateRegionDto, true), this.updateRegion);
    }

    private findRegionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const region = await this.regionsService.findRegionById(id);
            if (region) {
                return res.send(region);
            }
            next(new RegionNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllRegions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const regions = await this.regionsService.findAllRegions();
            res.send(regions);
        } catch (error) {
            next(error);
        }
    }

    private createRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const regionData: CreateRegionDto = req.body;
            const newRegionResult = await this.regionsService.createRegion(
                regionData,
                (req as RequestWithUser).user
            );
            res.send(newRegionResult);
        } catch (error) {
            next(error);
        }
    }

    private deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteRegionResult = await this.regionsService.deleteRegion(id);
            if (deleteRegionResult) {
                return res.send(deleteRegionResult);
            }
            next(new RegionNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const regionData: UpdateRegionDto = req.body;
            const { id } = req.params;
            const updateRegionResult = await this.regionsService.updateRegion(
                id,
                regionData
            );
            if (updateRegionResult) {
                return res.send(updateRegionResult);
            }
            next(new RegionNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }
}