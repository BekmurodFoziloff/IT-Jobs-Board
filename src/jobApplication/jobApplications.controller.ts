import { Router, Request, Response, NextFunction } from 'express';
import { JobApplicationsService } from './jobApplications.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateJobApplicationDto } from './dto/createJobApplication.dto';
import JobApplicationNotFoundException from '../exceptions/JobApplicationNotFoundException';
import JobNotFoundException from '../exceptions/JobNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { JobsService } from '../jobs/jobs.service';

export class JobApplicationsController {
    public path = '/applicants';
    public router = Router();

    constructor(
        private jobApplicationsService: JobApplicationsService,
        private jobsService: JobsService
    ) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(`/job/:id/apply`)
            .post(dtoValidationMiddleware(CreateJobApplicationDto), this.createJobApplication);
        this.router.route(`/my/residents${this.path}/list`)
            .get(authMiddleware, this.getAllJobsApllicationsOfUser);
        this.router.route(`/my/residents${this.path}/list/:id/delete`)
            .delete(authMiddleware, this.deleteJobApplication);
        this.router.route(`/my/residents${this.path}/list/delete-all`)
            .delete(authMiddleware, this.deleteAllJobsApllicationsOfUser);
    }

    private createJobApplication = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const job = await this.jobsService.findJobById(id);
        if (job) {
            const jobApplicationData: CreateJobApplicationDto = req.body;
            const newJobApplicationResult = await this.jobApplicationsService.createJobApplication(jobApplicationData, job.owner);
            return res.send(newJobApplicationResult);
        }
        next(new JobNotFoundException(id));
    }

    private getAllJobsApllicationsOfUser = async (req: Request, res: Response) => {
        const jobOwnerId = (req as RequestWithUser).user.id;
        const { query } = req;
        const jobs = await this.jobApplicationsService.getAllJobApllicationsOfUser(jobOwnerId, query);
        return res.send(jobs);
    }

    private deleteJobApplication = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteJobApplicationResult = await this.jobApplicationsService.deleteJobApplication(id);
        if (deleteJobApplicationResult) {
            return res.send(deleteJobApplicationResult);
        }
        next(new JobApplicationNotFoundException(id));
    }

    private deleteAllJobsApllicationsOfUser = async (req: Request, res: Response) => {
        const jobOwnerId = (req as RequestWithUser).user.id;
        const deleteJobApplicationsResult = await this.jobApplicationsService.deleteAllJobApplications(jobOwnerId);
        return res.send(deleteJobApplicationsResult);
    }
}