import { Router, Request, Response, NextFunction } from 'express';
import { JobsService } from './jobs.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateJobDto from './dto/createJob.dto';
import UpdateJobDto from './dto/updateJob.dto';
import JobNotFoundException from '../exceptions/JobNotFoundException';

export class JobsController {
    public path = '/job';
    public router = Router();

    constructor(private jobsService: JobsService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllJobs)
            .post(dtoValidationMiddleware(CreateJobDto), this.createJob);
        this.router.route(`${this.path}/:id`)
            .get(this.findJobById)
            .delete(this.deleteJob)
            .put(dtoValidationMiddleware(UpdateJobDto, true), this.updateJob);
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
        const jobs = await this.jobsService.findAllJobs();
        res.send(jobs);
    }

    private createJob = async (req: Request, res: Response) => {
        const jobData: CreateJobDto = req.body;
        const newJobResult = await this.jobsService.createJob(jobData);
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
        const updateJobResult = await this.jobsService.findJobById(id);
        if (updateJobResult) {
            return res.send(updateJobResult);
        }
        next(new JobNotFoundException(id));
    }
}