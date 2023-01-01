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

    constructor(private industrysService: IndustriesService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllIndustries)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateIndustryDto), this.createIndustry);
        this.router.route(`${this.path}/:id`)
            .get(this.findIndustryById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteIndustry)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateIndustryDto, true), this.updateIndustry);
    }

    private findIndustryById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const industry = await this.industrysService.findIndustryById(id);
        if (industry) {
            return res.send(industry);
        }
        next(new IndustryNotFoundException(id));
    }

    private findAllIndustries = async (req: Request, res: Response) => {
        const industrys = await this.industrysService.findAllIndustries();
        res.send(industrys);
    }

    private createIndustry = async (req: Request, res: Response) => {
        const industryData: CreateIndustryDto = req.body;
        const newIndustryResult = await this.industrysService.createIndustry(
            industryData,
            (req as RequestWithUser).user
        );
        res.send(newIndustryResult);
    }

    private deleteIndustry = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteIndustryResult = await this.industrysService.deleteIndustry(id);
        if (deleteIndustryResult) {
            return res.send(deleteIndustryResult);
        }
        next(new IndustryNotFoundException(id));
    }

    private updateIndustry = async (req: Request, res: Response, next: NextFunction) => {
        const industryData: UpdateIndustryDto = req.body;
        const { id } = req.params;
        await this.industrysService.updateIndustry(
            id,
            industryData
        );
        const updateIndustryResult = await this.industrysService.findIndustryById(id);
        if (updateIndustryResult) {
            return res.send(updateIndustryResult);
        }
        next(new IndustryNotFoundException(id));
    }
}