import { Router, Request, Response, NextFunction } from 'express';
import { SkillsService } from './skills.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import SkillNotFoundException from '../exceptions/SkillNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class SkillsController {
    public path = '/skill';
    public router = Router();

    constructor(private skillsService: SkillsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllSkills)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateSkillDto), this.createSkill);
        this.router.route(`${this.path}/:id`)
            .get(this.findSkillById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteSkill)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateSkillDto, true), this.updateSkill);
    }

    private findSkillById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const skill = await this.skillsService.findSkillById(id);
            if (skill) {
                return res.send(skill);
            }
            next(new SkillNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllSkills = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const skills = await this.skillsService.findAllSkills();
            res.send(skills);
        } catch (error) {
            next(error);
        }
    }

    private createSkill = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const skillData: CreateSkillDto = req.body;
            const newSkillResult = await this.skillsService.createSkill(
                skillData,
                (req as RequestWithUser).user
            );
            res.send(newSkillResult);
        } catch (error) {
            next(error);
        }
    }

    private deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteSkillResult = await this.skillsService.deleteSkill(id);
            if (deleteSkillResult) {
                return res.send(deleteSkillResult);
            }
            next(new SkillNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateSkill = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const skillData: UpdateSkillDto = req.body;
            const { id } = req.params;
            const updateSkillResult = await this.skillsService.updateSkill(
                id,
                skillData
            );
            if (updateSkillResult) {
                return res.send(updateSkillResult);
            }
            next(new SkillNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }
}