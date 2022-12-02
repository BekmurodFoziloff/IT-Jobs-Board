import { Router, Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { JobsService } from '../jobs/jobs.service';
import authMiddleware from '../middlewares/auth.middleware';

export class UsersController {
    public path = '/my';
    public router = Router();

    constructor(private jobsService: JobsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(`${this.path}/job/list`).get(authMiddleware, this.getAllJobsOfUser);
    }

    private getAllJobsOfUser = async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as RequestWithUser).user.id;
        const jobs = await this.jobsService.getAllJobsOfUser(userId);
        if (jobs) {
            return res.send(jobs);
        }
        next(new NotAuthorizedException());
    }
    
}