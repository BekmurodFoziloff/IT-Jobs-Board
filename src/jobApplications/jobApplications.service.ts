import JobApplicationModel from './jobApplication.model';
import { CreateJobApplicationDto } from './dto/createJobApplication.dto';
import { JobApplication } from './jobApplication.interface';
import moment from 'moment';
import { User } from '../users/user.interface';
import jobApplicationFilterQuery from '../interfaces/jobApplicationFilterQuery.interface';

export class JobApplicationsService {
  private jobApplicationModel = JobApplicationModel;

  public async createJobApplication(
    jobApplication: CreateJobApplicationDto,
    jobOwner: User,
    resume: any
  ): Promise<JobApplication> {
    const newJobApplication = await this.jobApplicationModel.create({
      ...jobApplication,
      jobOwner,
      resume,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    return await newJobApplication.save();
  }

  public async getAllJobApllicationsOfUser(jobOwnerId: string, queryObj: any): Promise<JobApplication[] | null> {
    const query: jobApplicationFilterQuery = {};
    let pageNumber = 1;
    const pageSize = Number(process.env.PAGE_SIZE);
    if (queryObj.page) {
      pageNumber = Number(queryObj.page);
    } else if (jobOwnerId) {
      query['jobOwner'] = jobOwnerId;
    } else if (queryObj.gender && queryObj.gender.length > 0) {
      query['gender'] = { $in: queryObj.gender };
    } else if (queryObj.workExperience) {
      query['workExperience'] = query.workExperience;
    }
    return await this.jobApplicationModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize);
  }

  public async deleteJobApplication(id: string): Promise<JobApplication | null> {
    return await this.jobApplicationModel.findByIdAndDelete(id);
  }

  public async deleteAllJobApplications(jobOwnerId: string): Promise<object> {
    return await this.jobApplicationModel.deleteMany({ jobOwner: jobOwnerId });
  }
}
