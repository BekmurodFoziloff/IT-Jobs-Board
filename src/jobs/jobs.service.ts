import JobModel from './job.model';
import CreateJobDto from './dto/createJob.dto';
import UpdateJobDto from './dto/updateJob.dto';
import { Job } from './job.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class JobsService {
    private jobModel = JobModel;

    public async findJobById(id: string): Promise<Job | null> {
        return await this.jobModel.findById(id)
            .populate('user', '-password -createdAt');
    }

    public async findAllJobs(): Promise<Job[]> {
        return await this.jobModel.find({})
            .populate('user', '-password -createdAt');
    }

    public async createJob(job: CreateJobDto, user: User): Promise<Job> {
        const newJob = await this.jobModel.create({
            ...job,
            user,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newJob.save();
        await (await newJob
            .populate('user', '-password -createdAt'));
        return newJob;
    }

    public async deleteJob(id: string): Promise<Job | null> {
        return await this.jobModel.findByIdAndDelete(id)
            .populate('user', '-password -createdAt');
    }

    public async updateJob(id: string, job: UpdateJobDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                ...job,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('user', '-password -createdAt');
    }

    public async getAllJobsOfUser(userId: string): Promise<Job[] | null> {
        return await this.jobModel.find({ user: userId })
            .populate('user', '-password -createdAt');
    }
}