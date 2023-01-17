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

  constructor(private jobApplicationsService: JobApplicationsService, private jobsService: JobsService) {
    this.setRoutes();
  }

  public setRoutes() {
    this.router
      .route(`/job/:id/apply`)
      .post(upload.single('resume'), dtoValidationMiddleware(CreateJobApplicationDto), this.createJobApplication);
    this.router.route(`/my/residents${this.path}/list`).get(authMiddleware, this.getAllJobsApllicationsOfUser);
    this.router.route(`/my/residents${this.path}/list/:id/delete`).delete(authMiddleware, this.deleteJobApplication);
    this.router
      .route(`/my/residents${this.path}/list/delete/all`)
      .delete(authMiddleware, this.deleteAllJobsApllications);
  }

  private createJobApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { file } = req;
      const job = await this.jobsService.findJobById(id);
      if (job) {
        const jobApplicationData: CreateJobApplicationDto = req.body;
        const newJobApplication = await this.jobApplicationsService.createJobApplication(
          jobApplicationData,
          job.owner,
          file?.path
        );
        return res.status(201).json(newJobApplication);
      }
      next(new JobNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private getAllJobsApllicationsOfUser = async (req: Request, res: Response) => {
    try {
      const jobOwnerId = (req as RequestWithUser).user.id;
      const { query } = req;
      const jobApplications = await this.jobApplicationsService.getAllJobApllicationsOfUser(jobOwnerId, query);
      return res.status(200).json(jobApplications);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteJobApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteJobApplication = await this.jobApplicationsService.deleteJobApplication(id);
      if (deleteJobApplication) {
        return res.status(200).json(deleteJobApplication);
      }
      next(new JobApplicationNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteAllJobsApllications = async (req: Request, res: Response) => {
    try {
      const jobOwnerId = (req as RequestWithUser).user.id;
      const deleteAllJobApplications = await this.jobApplicationsService.deleteAllJobApplications(jobOwnerId);
      return res.status(200).json(deleteAllJobApplications);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
