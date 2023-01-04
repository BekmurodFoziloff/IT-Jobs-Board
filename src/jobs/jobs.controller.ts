import { Router, Request, Response, NextFunction } from 'express';
import { JobsService } from './jobs.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateJobDto from './dto/createJob.dto';
import {
    UpdateJobDto,
    UpdateEmployerDto,
    UpdateRequirementsDto
} from './dto/updateJob.dto';
import JobNotFoundException from '../exceptions/JobNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import isOwnerJob from '../middlewares/isOwnerJob.middleware';

export class JobsController {
    public path = '/job';
    public router = Router();

    constructor(private jobsService: JobsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllJobs);
        this.router.route(`/my${this.path}/list`)
            .get(authMiddleware, this.getAllJobsOfUser);
        this.router.route(`/my${this.path}/new`)
            .post(authMiddleware, dtoValidationMiddleware(CreateJobDto), this.createJob);
        this.router.route(`${this.path}/:id`)
            .get(this.findJobById);
        this.router.route(`/my${this.path}/:id/edit`)
            .put(authMiddleware, isOwnerJob, dtoValidationMiddleware(UpdateJobDto, true), this.updateJob);
        this.router.route(`/my${this.path}/requirements/:id/edit`)
            .put(authMiddleware, isOwnerJob, dtoValidationMiddleware(UpdateRequirementsDto, true), this.updateRequirements);
        this.router.route(`/my${this.path}/employer/:id/edit`)
            .put(authMiddleware, isOwnerJob, dtoValidationMiddleware(UpdateEmployerDto, true), this.updateEmployer);
        this.router.route(`/my${this.path}/:id/delete`)
            .delete(authMiddleware, isOwnerJob, this.deleteJob);
        this.router.route(`/my${this.path}/:id/publish`)
            .put(authMiddleware, isOwnerJob, this.publish);
        this.router.route(`/my${this.path}/:id/publish-cancel`)
            .put(authMiddleware, isOwnerJob, this.publishCancel);
    }

    private findJobById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const job = await this.jobsService.findJobById(id);
        if (job) {
            return res.send(job);
        }
        next(new JobNotFoundException(id));
    }

    private findAllJobs = async (req: Request, res: Response) => {
        const { query } = req;
        const jobs = await this.jobsService.findAllJobs(query);
        res.send(jobs);
    }

    private createJob = async (req: Request, res: Response) => {
        const jobData: CreateJobDto = req.body;
        const newJobResult = await this.jobsService.createJob(
            jobData,
            (req as RequestWithUser).user
        );
        res.send(newJobResult);
    }

    private deleteJob = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteJobResult = await this.jobsService.deleteJob(id);
        if (deleteJobResult) {
            return res.send(deleteJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private updateJob = async (req: Request, res: Response, next: NextFunction) => {
        const jobData: UpdateJobDto = req.body;
        const { id } = req.params;
        const updateJobResult = await this.jobsService.updateJob(
            id,
            jobData
        );
        if (updateJobResult) {
            return res.send(updateJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private updateRequirements = async (req: Request, res: Response, next: NextFunction) => {
        const requirementsData: UpdateRequirementsDto = req.body;
        const { id } = req.params;
        const updateJobResult = await this.jobsService.updateRequirements(
            id,
            requirementsData
        )
        if (updateJobResult) {
            return res.send(updateJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private updateEmployer = async (req: Request, res: Response, next: NextFunction) => {
        const employerData: UpdateEmployerDto = req.body;
        const { id } = req.params;
        const updateJobResult = await this.jobsService.updateEmployer(
            id,
            employerData
        );
        if (updateJobResult) {
            return res.send(updateJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const publishJobResult = await this.jobsService.publish(id);
        if (publishJobResult) {
            return res.send(publishJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const publishCancelJobResult = await this.jobsService.publishCancel(id);
        if (publishCancelJobResult) {
            return res.send(publishCancelJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private getAllJobsOfUser = async (req: Request, res: Response) => {
        const userId = (req as RequestWithUser).user.id;
        const jobs = await this.jobsService.getAllJobsOfUser(userId);
        return res.send(jobs);
    }
}