import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { JobsService } from '../jobs/jobs.service';
import YouAreNotAllowedException from '../exceptions/YouAreNotAllowedException';

async function isOwnerJob(req: Request, res: Response, next: NextFunction) {
  try {
    const jobsService = new JobsService();
    const { id } = req.params;
    const job = await jobsService.getJobById(id);
    if (!(job?.owner.id.toString() === (req as RequestWithUser).user.id.toString())) {
      next(new YouAreNotAllowedException());
    }
    next();
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
}

export default isOwnerJob;
