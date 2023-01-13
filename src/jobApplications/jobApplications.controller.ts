import { Router, Request, Response, NextFunction } from 'express';
import { JobApplicationsService } from './jobApplications.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateJobApplicationDto } from './dto/createJobApplication.dto';
import JobApplicationNotFoundException from '../exceptions/JobApplicationNotFoundException';
import JobNotFoundException from '../exceptions/JobNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { JobsService } from '../jobs/jobs.service';
import { upload } from '../files/files.service';

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
            .post(upload.single('resume'), dtoValidationMiddleware(CreateJobApplicationDto), this.createJobApplication);
        this.router.route(`/my/residents${this.path}/list`)
            .get(authMiddleware, this.getAllJobsApllicationsOfUser);
        this.router.route(`/my/residents${this.path}/list/:id/delete`)
            .delete(authMiddleware, this.deleteJobApplication);
        this.router.route(`/my/residents${this.path}/list/delete-all`)
            .delete(authMiddleware, this.deleteAllJobsApllications);
    }

    private createJobApplication = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { file } = req;
        const job = await this.jobsService.findJobById(id);
        if (job) {
            const jobApplicationData: CreateJobApplicationDto = req.body;
            const newJobApplicationResult = await this.jobApplicationsService.createJobApplication(
                jobApplicationData,
                job.owner,
                file?.path
            );
            return res.send(newJobApplicationResult);
        }
        next(new JobNotFoundException(id));
    }

    private getAllJobsApllicationsOfUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobOwnerId = (req as RequestWithUser).user.id;
            const { query } = req;
            const jobApplications = await this.jobApplicationsService.getAllJobApllicationsOfUser(jobOwnerId, query);
            return res.send(jobApplications);
        } catch (error) {
            next(error);
        }
    }

    private deleteJobApplication = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteJobApplicationResult = await this.jobApplicationsService.deleteJobApplication(id);
            if (deleteJobApplicationResult) {
                return res.send(deleteJobApplicationResult);
            }
            next(new JobApplicationNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private deleteAllJobsApllications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobOwnerId = (req as RequestWithUser).user.id;
            const deleteAllJobApplicationsResult = await this.jobApplicationsService.deleteAllJobApplications(jobOwnerId);
            return res.send(deleteAllJobApplicationsResult);
        } catch (error) {
            next(error);
        }
    }
}