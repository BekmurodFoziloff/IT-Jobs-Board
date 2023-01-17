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
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllSkills);
    this.router
      .route(`${this.path}/new`)
      .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateSkillDto), this.createSkill);
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findSkillById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateSkillDto, true), this.updateSkill);
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteSkill);
  }

  private findSkillById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const skill = await this.skillsService.findSkillById(id);
      if (skill) {
        return res.status(200).json(skill);
      }
      next(new SkillNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private findAllSkills = async (req: Request, res: Response) => {
    try {
      const skills = await this.skillsService.findAllSkills();
      return res.status(200).json(skills);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private createSkill = async (req: Request, res: Response) => {
    try {
      const skillData: CreateSkillDto = req.body;
      const newSkill = await this.skillsService.createSkill(skillData, (req as RequestWithUser).user);
      return res.status(201).json(newSkill);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skillData: UpdateSkillDto = req.body;
      const { id } = req.params;
      const updateSkill = await this.skillsService.updateSkill(id, skillData);
      if (updateSkill) {
        return res.status(200).json(updateSkill);
      }
      next(new SkillNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteSkill = await this.skillsService.deleteSkill(id);
      if (deleteSkill) {
        return res.status(200).json(deleteSkill);
      }
      next(new SkillNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
