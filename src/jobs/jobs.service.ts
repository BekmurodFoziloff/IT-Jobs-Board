import JobModel from './job.model';
import CreateJobDto from './dto/createJob.dto';
import UpdateJobDto, { UpdateGeneralInformationAboutTheEmployerDto, UpdateJobRequirementsDto } from './dto/updateJob.dto';
import { Job } from './job.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class JobsService {
    private jobModel = JobModel;

    public async findJobById(id: string): Promise<Job | null> {
        return await this.jobModel.findById(id)
            .populate('owner', '-password -createdAt')
            .populate('employmentTypes', '-createdAt -owner')
            .populate('workStyles', '-createdAt -owner')
            .populate('jobRequirements.workExperience', '-createdAt -owner')
            .populate('jobRequirements.requiredSkills', '-createdAt -owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-createdAt -owner');
    }

    public async findAllJobs(): Promise<Job[]> {
        return await this.jobModel.find({})
            .populate('owner', '-password -createdAt')
            .populate('employmentTypes', '-createdAt -owner')
            .populate('workStyles', '-createdAt -owner')
            .populate('jobRequirements.workExperience', '-createdAt -owner')
            .populate('jobRequirements.requiredSkills', '-createdAt -owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-createdAt -owner');
    }

    public async createJob(job: CreateJobDto, owner: User): Promise<Job> {
        const newJob = await this.jobModel.create({
            ...job,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newJob.save();
        await (await newJob
            .populate('owner', '-password -createdAt'))
            .populate('specializationCategories', '-createdAt -owner');
        return newJob;
    }

    public async deleteJob(id: string): Promise<Job | null> {
        return await this.jobModel.findByIdAndDelete(id)
            .populate('owner', '-password -createdAt')
            .populate('employmentTypes', '-createdAt -owner')
            .populate('workStyles', '-createdAt -owner')
            .populate('jobRequirements.workExperience', '-createdAt -owner')
            .populate('jobRequirements.requiredSkills', '-createdAt -owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-createdAt -owner');
    }

    public async updateJob(id: string, job: UpdateJobDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                ...job,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password -createdAt')
            .populate('employmentTypes', '-createdAt -owner')
            .populate('workStyles', '-createdAt -owner')
            .populate('jobRequirements.workExperience', '-createdAt -owner')
            .populate('jobRequirements.requiredSkills', '-createdAt -owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-createdAt -owner');
    }

    public async updateJobRequirements(id: string, job: UpdateJobRequirementsDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'jobRequirements': job
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password -createdAt')
            .populate('employmentTypes', '-createdAt -owner')
            .populate('workStyles', '-createdAt -owner')
            .populate('jobRequirements.workExperience', '-createdAt -owner')
            .populate('jobRequirements.requiredSkills', '-createdAt -owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-createdAt -owner');
    }

    public async updateJobGeneralInformationAboutTheEmployer(id: string, job: UpdateGeneralInformationAboutTheEmployerDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'generalInformationAboutTheEmployer': job
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password -createdAt')
            .populate('employmentTypes', '-createdAt -owner')
            .populate('workStyles', '-createdAt -owner')
            .populate('jobRequirements.workExperience', '-createdAt -owner')
            .populate('jobRequirements.requiredSkills', '-createdAt -owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-createdAt -owner');
    }

    public async getAllJobsOfUser(userId: string): Promise<Job[] | null> {
        return await this.jobModel.find({ owner: userId })
            .populate('owner', '-password -createdAt')
            .populate('employmentTypes', '-createdAt -owner')
            .populate('workStyles', '-createdAt -owner')
            .populate('jobRequirements.workExperience', '-createdAt -owner')
            .populate('jobRequirements.requiredSkills', '-createdAt -owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-createdAt -owner');
    }
}