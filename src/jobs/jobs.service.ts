import JobModel from './job.model';
import CreateJobDto from './dto/createJob.dto';
import UpdateJobDto from './dto/updateJob.dto';
import { Job } from './job.interface';
import moment from 'moment';

export class JobsService {
    private jobModel = JobModel;

    public async findJobById(id: string): Promise<Job | null> {
        return await this.jobModel.findById(id);
    }

    public async findAllJobs(): Promise<Job[]> {
        return await this.jobModel.find({});
    }

    public async createJob(job: CreateJobDto): Promise<Job> {
        const newJob = await this.jobModel.create({
            ...job,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        return newJob.save();
    }

    public async deleteJob(id: string): Promise<Job | null> {
        return await this.jobModel.findByIdAndDelete(id);
    }

    public async updateJob(id: string, job: UpdateJobDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                ...job,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        );
    }
}