import { Router, Request, Response, NextFunction } from 'express';
import { RequiredSkillsService } from './requiredSkills.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateRequiredSkillDto } from './dto/createRequiredSkill.dto';
import { UpdateRequiredSkillDto } from './dto/updateRequiredSkill.dto';
import RequiredSkillNotFoundException from '../exceptions/RequiredSkillNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class RequiredSkillsController {
    public path = '/required-skill';
    public router = Router();

    constructor(private requiredSkillsService: RequiredSkillsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllRequiredSkills)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateRequiredSkillDto), this.createRequiredSkill);
        this.router.route(`${this.path}/:id`)
            .get(this.findRequiredSkillById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteRequiredSkill)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateRequiredSkillDto, true), this.updateRequiredSkill);
    }

    private findRequiredSkillById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const requiredSkill = await this.requiredSkillsService.findRequiredSkillById(id);
        if (requiredSkill) {
            return res.send(requiredSkill);
        }
        next(new RequiredSkillNotFoundException(id));
    }

    private findAllRequiredSkills = async (req: Request, res: Response) => {
        const requiredSkills = await this.requiredSkillsService.findAllRequiredSkills();
        res.send(requiredSkills);
    }

    private createRequiredSkill = async (req: Request, res: Response) => {
        const requiredSkillData: CreateRequiredSkillDto = req.body;
        const newRequiredSkillResult = await this.requiredSkillsService.createRequiredSkill(
            requiredSkillData,
            (req as RequestWithUser).user
        );
        res.send(newRequiredSkillResult);
    }

    private deleteRequiredSkill = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteRequiredSkillResult = await this.requiredSkillsService.deleteRequiredSkill(id);
        if (deleteRequiredSkillResult) {
            return res.send(deleteRequiredSkillResult);
        }
        next(new RequiredSkillNotFoundException(id));
    }

    private updateRequiredSkill = async (req: Request, res: Response, next: NextFunction) => {
        const requiredSkillData: UpdateRequiredSkillDto = req.body;
        const { id } = req.params;
        await this.requiredSkillsService.updateRequiredSkill(
            id,
            requiredSkillData
        );
        const updateRequiredSkillResult = await this.requiredSkillsService.findRequiredSkillById(id);
        if (updateRequiredSkillResult) {
            return res.send(updateRequiredSkillResult);
        }
        next(new RequiredSkillNotFoundException(id));
    }
}