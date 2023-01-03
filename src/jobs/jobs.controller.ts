import { Router, Request, Response, NextFunction } from 'express';
import { JobsService } from './jobs.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateJobDto from './dto/createJob.dto';
import {
    UpdateJobDto,
    UpdateGeneralInformationAboutTheEmployerDto,
    UpdateJobRequirementsDto
} from './dto/updateJob.dto';
import JobNotFoundException from '../exceptions/JobNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

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
            .put(authMiddleware, dtoValidationMiddleware(UpdateJobDto, true), this.updateJob);
        this.router.route(`/my${this.path}/requirements/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateJobRequirementsDto, true), this.updateJobRequirements);
        this.router.route(`/my${this.path}/employer/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateGeneralInformationAboutTheEmployerDto, true), this.updateJobGeneralInformationAboutTheEmployer);
        this.router.route(`/my${this.path}/:id/delete`)
            .delete(authMiddleware, this.deleteJob);
        this.router.route(`/my${this.path}/:id/publish`)
            .put(authMiddleware, this.publish);
        this.router.route(`/my${this.path}/:id/publish-cancel`)
            .put(authMiddleware, this.publishCancel);
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
        await this.jobsService.updateJob(
            id,
            jobData
        );
        const updateJobResult = await this.jobsService.findJobByIdForUpdate(id);
        if (updateJobResult) {
            return res.send(updateJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private updateJobRequirements = async (req: Request, res: Response, next: NextFunction) => {
        const jobData: UpdateJobRequirementsDto = req.body;
        const { id } = req.params;
        await this.jobsService.updateJobRequirements(
            id,
            jobData
        );
        const updateJobResult = await this.jobsService.findJobByIdForUpdate(id);
        if (updateJobResult) {
            return res.send(updateJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private updateJobGeneralInformationAboutTheEmployer = async (req: Request, res: Response, next: NextFunction) => {
        const jobData: UpdateGeneralInformationAboutTheEmployerDto = req.body;
        const { id } = req.params;
        await this.jobsService.updateJobGeneralInformationAboutTheEmployer(
            id,
            jobData
        );
        const updateJobResult = await this.jobsService.findJobByIdForUpdate(id);
        if (updateJobResult) {
            return res.send(updateJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.jobsService.publish(id);
        const publishJobResult = await this.jobsService.findJobByIdForUpdate(id);
        if (publishJobResult) {
            return res.send(publishJobResult);
        }
        next(new JobNotFoundException(id));
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.jobsService.publishCancel(id);
        const publishCancelJobResult = await this.jobsService.findJobByIdForUpdate(id);
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