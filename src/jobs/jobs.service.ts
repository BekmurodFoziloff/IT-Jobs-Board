import JobModel from './job.model';
import CreateJobDto from './dto/createJob.dto';
import {
    UpdateJobDto,
    UpdateEmployerDto,
    UpdateRequirementsDto
} from './dto/updateJob.dto';
import { Job } from './job.interface';
import moment from 'moment';
import { User } from '../users/user.interface';
import { Conditions } from '../utils/enums/condition.enum';
import JobFilterQuery from '../interfaces/jobFilterQuery.interface';

export class JobsService {
    private jobModel = JobModel;

    public async findJobById(id: string): Promise<Job | null> {
        return await this.jobModel.findById(id)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async findAllJobs(queryObj: any): Promise<Job[] | null> {
        const query: JobFilterQuery = {};
        if (queryObj.employmentTypes && queryObj.employmentTypes.length > 0) {
            query['employmentTypes'] = { $in: queryObj.employmentTypes }
        } else if (queryObj.workExperience) {
            query['requirements.workExperience'] = { $in: queryObj.workExperience }
        } else if (queryObj.specializationCategories && queryObj.specializationCategories.length > 0) {
            query['specializationCategories'] = { $in: queryObj.specializationCategories }
        } else if (queryObj.skills && queryObj.skills.length > 0) {
            query['requirements.skills'] = { $in: queryObj.skills }
        }
        return await this.jobModel.find(query)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async createJob(job: CreateJobDto, owner: User): Promise<Job> {
        const newJob = await this.jobModel.create({
            ...job,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newJob.save();
        return await newJob
            .populate('owner', 'email firstName lastName id');
    }

    public async deleteJob(id: string): Promise<Job | null> {
        return await this.jobModel.findByIdAndDelete(id)
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async updateJob(id: string, job: UpdateJobDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                ...job,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async updateRequirements(id: string, requrements: UpdateRequirementsDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'requirements': {
                        '_id': id,
                        ...requrements
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async updateEmployer(id: string, employer: UpdateEmployerDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'employer': {
                        '_id': id,
                        ...employer
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async getAllJobsOfUser(userId: string): Promise<Job[] | null> {
        return await this.jobModel.find({ owner: userId })
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async getJobById(id: string): Promise<Job | null> {
        return await this.jobModel.findById(id)
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async publish(id: string, condition = Conditions.PUBLIC): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }

    public async publishCancel(id: string, condition = Conditions.PRIVATE): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('employmentTypes', '-owner -createdAt -updatedAt')
            .populate('specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workStyles', '-owner -createdAt -updatedAt')
            .populate('requirements.workExperience', '-owner -createdAt -updatedAt')
            .populate('requirements.skills', '-owner -createdAt -updatedAt')
            .populate('employer.legalForm', '-owner -createdAt -updatedAt');
    }
}