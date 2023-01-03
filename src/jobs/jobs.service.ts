import JobModel from './job.model';
import CreateJobDto from './dto/createJob.dto';
import {
    UpdateJobDto,
    UpdateGeneralInformationAboutTheEmployerDto,
    UpdateJobRequirementsDto
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
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async findAllJobs(queryObj: any): Promise<Job[] | null> {
        const query: JobFilterQuery = {};
        if (queryObj.employmentTypes && queryObj.employmentTypes.length > 0) {
            query['employmentTypes'] = { $in: queryObj.employmentTypes }
        } else if (queryObj.workExperience) {
            query['jobRequirements.workExperience'] = { $in: queryObj.workExperience }
        } else if (queryObj.specializationCategories && queryObj.specializationCategories.length > 0) {
            query['specializationCategories'] = { $in: queryObj.specializationCategories }
        } else if (queryObj.requiredSkills && queryObj.requiredSkills.length > 0) {
            query['jobRequirements.requiredSkills'] = { $in: queryObj.requiredSkills }
        }
        return await this.jobModel.find(query)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async createJob(job: CreateJobDto, owner: User): Promise<Job> {
        const newJob = await this.jobModel.create({
            ...job,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newJob.save();
        return await newJob
            .populate('owner', '-password');
    }

    public async deleteJob(id: string): Promise<Job | null> {
        return await this.jobModel.findByIdAndDelete(id)
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async updateJob(id: string, job: UpdateJobDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                ...job,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async updateJobRequirements(id: string, job: UpdateJobRequirementsDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'jobRequirements': {
                        '_id': id,
                        ...job
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async updateJobGeneralInformationAboutTheEmployer(id: string, job: UpdateGeneralInformationAboutTheEmployerDto): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'generalInformationAboutTheEmployer': {
                        '_id': id,
                        ...job
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async getAllJobsOfUser(userId: string): Promise<Job[] | null> {
        return await this.jobModel.find({ owner: userId })
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async findJobByIdForUpdate(id: string): Promise<Job | null> {
        return await this.jobModel.findById(id)
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async publish(id: string, condition = Conditions.PUBLIC): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            }
        )
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }

    public async publishCancel(id: string, condition = Conditions.PRIVATE): Promise<Job | null> {
        return await this.jobModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            }
        )
            .populate('owner', '-password')
            .populate('employmentTypes', '-owner')
            .populate('specializationCategories', '-owner')
            .populate('workStyles', '-owner')
            .populate('jobRequirements.workExperience', '-owner')
            .populate('jobRequirements.requiredSkills', '-owner')
            .populate('generalInformationAboutTheEmployer.legalForm', '-owner');
    }
}