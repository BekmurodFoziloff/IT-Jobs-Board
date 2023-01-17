import { Router, Request, Response, NextFunction } from 'express';
import { JobsService } from './jobs.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateJobDto from './dto/createJob.dto';
import UpdateJobDto from './dto/updateJob.dto';
import UpdateRequirementsDto from './dto/updateRequirements.dto';
import UpdateEmployerDto from './dto/updateEmployer.dto';
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
    this.router.route(this.path).get(this.findAllJobs);
    this.router.route(`/my${this.path}/list`).get(authMiddleware, this.getAllJobsOfUser);
    this.router
      .route(`/my${this.path}/new`)
      .post(authMiddleware, dtoValidationMiddleware(CreateJobDto), this.createJob);
    this.router.route(`${this.path}/:id`).get(this.findJobById);
    this.router
      .route(`/my${this.path}/:id/edit`)
      .put(authMiddleware, isOwnerJob, dtoValidationMiddleware(UpdateJobDto, true), this.updateJob);
    this.router
      .route(`/my${this.path}/requirements/:id/edit`)
      .put(authMiddleware, isOwnerJob, dtoValidationMiddleware(UpdateRequirementsDto, true), this.updateRequirements);
    this.router
      .route(`/my${this.path}/employer/:id/edit`)
      .put(authMiddleware, isOwnerJob, dtoValidationMiddleware(UpdateEmployerDto, true), this.updateEmployer);
    this.router.route(`/my${this.path}/:id/delete`).delete(authMiddleware, isOwnerJob, this.deleteJob);
    this.router.route(`/my${this.path}/:id/publish`).put(authMiddleware, isOwnerJob, this.publish);
    this.router.route(`/my${this.path}/:id/publish/cancel`).put(authMiddleware, isOwnerJob, this.publishCancel);
  }

  private findJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const job = await this.jobsService.findJobById(id);
      if (job) {
        return res.status(200).json(job);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private findAllJobs = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const jobs = await this.jobsService.findAllJobs(query);
      return res.status(200).json(jobs);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private createJob = async (req: Request, res: Response) => {
    try {
      const jobData: CreateJobDto = req.body;
      const newJob = await this.jobsService.createJob(jobData, (req as RequestWithUser).user);
      return res.status(201).json(newJob);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobData: UpdateJobDto = req.body;
      const { id } = req.params;
      const updateJob = await this.jobsService.updateJob(id, jobData);
      if (updateJob) {
        return res.status(200).json(updateJob);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteJob = await this.jobsService.deleteJob(id);
      if (deleteJob) {
        return res.status(200).json(deleteJob);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateRequirements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requirementsData: UpdateRequirementsDto = req.body;
      const { id } = req.params;
      const updateJob = await this.jobsService.updateRequirements(id, requirementsData);
      if (updateJob) {
        return res.status(200).json(updateJob);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateEmployer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerData: UpdateEmployerDto = req.body;
      const { id } = req.params;
      const updateJob = await this.jobsService.updateEmployer(id, employerData);
      if (updateJob) {
        return res.status(200).json(updateJob);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private getAllJobsOfUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as RequestWithUser).user.id;
      const jobs = await this.jobsService.getAllJobsOfUser(userId);
      return res.status(200).json(jobs);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishJob = await this.jobsService.publish(id);
      if (publishJob) {
        return res.status(200).json(publishJob);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishCancelJob = await this.jobsService.publishCancel(id);
      if (publishCancelJob) {
        return res.status(200).json(publishCancelJob);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
