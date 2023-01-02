import JobApplicationModel from './jobApplication.model';
import { CreateJobApplicationDto } from './dto/createJobApplication.dto';
import { JobApplication } from './jobApplication.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class JobApplicationsService {
    private jobApplicationModel = JobApplicationModel;

    public async createJobApplication(jobApplication: CreateJobApplicationDto, jobOwner: User): Promise<JobApplication> {
        const newJobApplication = await this.jobApplicationModel.create({
            ...jobApplication,
            jobOwner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        return await newJobApplication.save();
    }

    public async getAllJobApllicationsOfUser(jobOwnerId: string, query: object): Promise<JobApplication[] | null> {
        return await this.jobApplicationModel.find(
            {
                jobOwner: jobOwnerId,
                ...query
            }
        );
    }

    public async deleteJobApplication(id: string): Promise<JobApplication | null> {
        return await this.jobApplicationModel.findByIdAndDelete(id);
    }

    public async deleteAllJobApplications(jobOwnerId: string): Promise<object> {
        return await this.jobApplicationModel.deleteMany({ jobOwner: jobOwnerId });
    }
}