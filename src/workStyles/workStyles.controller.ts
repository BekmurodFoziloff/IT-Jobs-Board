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
    public path = '/work-style';
    public router = Router();

    constructor(private workStylesService: WorkStylesService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllWorkStyles)
            .post(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(CreateWorkStyleDto), this.createWorkStyle);
        this.router.route(`${this.path}/:id`)
            .get(this.findWorkStyleById)
            .delete(authMiddleware, adminAuthMiddleware, this.deleteWorkStyle)
            .put(authMiddleware, adminAuthMiddleware, dtoValidationMiddleware(UpdateWorkStyleDto, true), this.updateWorkStyle);
    }

    private findWorkStyleById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const workStyle = await this.workStylesService.findWorkStyleById(id);
            if (workStyle) {
                return res.send(workStyle);
            }
            next(new WorkStyleNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllWorkStyles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const WorkStyles = await this.workStylesService.findAllWorkStyles();
            res.send(WorkStyles);
        } catch (error) {
            next(error);
        }
    }

    private createWorkStyle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const workStyleData: CreateWorkStyleDto = req.body;
            const newWorkStyleResult = await this.workStylesService.createWorkStyle(
                workStyleData,
                (req as RequestWithUser).user
            );
            res.send(newWorkStyleResult);
        } catch (error) {
            next(error);
        }
    }

    private deleteWorkStyle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteWorkStyleResult = await this.workStylesService.deleteWorkStyle(id);
            if (deleteWorkStyleResult) {
                return res.send(deleteWorkStyleResult);
            }
            next(new WorkStyleNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateWorkStyle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const workStyleData: UpdateWorkStyleDto = req.body;
            const { id } = req.params;
            const updateWorkStyleResult = await this.workStylesService.updateWorkStyle(
                id,
                workStyleData
            );
            if (updateWorkStyleResult) {
                return res.send(updateWorkStyleResult);
            }
            next(new WorkStyleNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }
}