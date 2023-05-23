import { Router, Request, Response, NextFunction } from 'express';
import { WorkStylesService } from './workStyles.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateWorkStyleDto } from './dto/createWorkStyle.dto';
import { UpdateWorkStyleDto } from './dto/updateWorkStyle.dto';
import WorkStyleNotFoundException from '../exceptions/WorkStyleNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';

export class WorkStylesController {
  public path = '/work/style';
  public router = Router();
  private workStylesService = new WorkStylesService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(`${this.path}`).get(authMiddleware, this.findAllWorkStyles);
    this.router
      .route(`${this.path}/new`)
      .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateWorkStyleDto), this.createWorkStyle);
    this.router.route(`${this.path}/:id`).get(authMiddleware, this.findWorkStyleById);
    this.router
      .route(`${this.path}/:id/edit`)
      .put(
        authMiddleware,
        adminAuthMiddleware,
        dtoValidationMiddleware(UpdateWorkStyleDto, true),
        this.updateWorkStyle
      );
    this.router.route(`${this.path}/:id/delete`).delete(authMiddleware, adminAuthMiddleware, this.deleteWorkStyle);
  }

  private findWorkStyleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workStyle = await this.workStylesService.findWorkStyleById(id);
      if (workStyle) {
        return res.status(200).json(workStyle);
      }
      next(new WorkStyleNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllWorkStyles = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const workStyles = await this.workStylesService.findAllWorkStyles(Number(page));
      return res.status(200).json(workStyles);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private createWorkStyle = async (req: Request, res: Response) => {
    try {
      const workStyleData: CreateWorkStyleDto = req.body;
      const newWorkStyle = await this.workStylesService.createWorkStyle(workStyleData, (req as RequestWithUser).user);
      return res.status(201).json(newWorkStyle);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateWorkStyle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workStyleData: UpdateWorkStyleDto = req.body;
      const { id } = req.params;
      const updateWorkStyle = await this.workStylesService.updateWorkStyle(id, workStyleData);
      if (updateWorkStyle) {
        return res.status(200).json(updateWorkStyle);
      }
      next(new WorkStyleNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteWorkStyle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteWorkStyle = await this.workStylesService.deleteWorkStyle(id);
      if (deleteWorkStyle) {
        return res.status(200).json(deleteWorkStyle);
      }
      next(new WorkStyleNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
