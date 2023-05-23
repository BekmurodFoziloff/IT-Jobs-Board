import JobModel from './job.model';
import CreateJobDto from './dto/createJob.dto';
import UpdateJobDto from './dto/updateJob.dto';
import UpdateRequirementsDto from './dto/updateRequirements.dto';
import UpdateEmployerDto from './dto/updateEmployer.dto';
import { Job } from './job.interface';
import moment from 'moment';
import { User } from '../users/user.interface';
import { PublishConditions } from '../utils/enums/publishCondition.enum';
import JobFilterQuery from '../interfaces/jobFilterQuery.interface';

export class JobsService {
  private jobModel = JobModel;

  public async findJobById(id: string): Promise<Job | null> {
    return await this.jobModel
      .findById(id)
      .where('isPublished')
      .equals(PublishConditions.PUBLIC)
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async findAllJobs(queryObj: any): Promise<Job[] | null> {
    const query: JobFilterQuery = {};
    let pageNumber = 1;
    const pageSize = Number(process.env.PAGE_SIZE);
    if (queryObj.page) {
      pageNumber = Number(queryObj.page);
    } else if (queryObj.search) {
      query['$or'] = [
        { title: { $regex: queryObj.search, $options: 'i' } },
        { description: { $regex: queryObj.search, $options: 'i' } },
        { task: { $regex: queryObj.search, $options: 'i' } },
        { schedule: { $regex: queryObj.search, $options: 'i' } }
      ];
    } else if (queryObj.employmentTypes && queryObj.employmentTypes.length > 0) {
      query['employmentTypes'] = { $in: queryObj.employmentTypes };
    } else if (queryObj.workExperience) {
      query['requirements.workExperience'] = { $in: queryObj.workExperience };
    } else if (queryObj.specializationCategories && queryObj.specializationCategories.length > 0) {
      query['specializationCategories'] = { $in: queryObj.specializationCategories };
    } else if (queryObj.skills && queryObj.skills.length > 0) {
      query['requirements.skills'] = { $in: queryObj.skills };
    }
    return await this.jobModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .where('isPublished')
      .equals(PublishConditions.PUBLIC)
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async createJob(job: CreateJobDto, owner: User): Promise<Job> {
    const newJob = await this.jobModel.create({
      ...job,
      owner,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    await newJob.save();
    return await newJob.populate('owner', 'email firstName lastName id');
  }

  public async updateJob(id: string, job: UpdateJobDto): Promise<Job | null> {
    return await this.jobModel
      .findByIdAndUpdate(
        id,
        {
          ...job,
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async deleteJob(id: string): Promise<Job | null> {
    return await this.jobModel
      .findByIdAndDelete(id)
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async updateRequirements(id: string, requrements: UpdateRequirementsDto): Promise<Job | null> {
    return await this.jobModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            requirements: {
              _id: id,
              ...requrements
            }
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async updateEmployer(id: string, employer: UpdateEmployerDto): Promise<Job | null> {
    return await this.jobModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            employer: {
              _id: id,
              ...employer
            }
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async getAllJobsOfUser(userId: string, queryObj: any): Promise<Job[] | null> {
    const query: JobFilterQuery = {};
    let pageNumber = 1;
    const pageSize = Number(process.env.PAGE_SIZE);
    if (userId) {
      query['owner'] = userId;
    } else if (queryObj.page) {
      pageNumber = Number(queryObj.page);
    } else if (queryObj.search) {
      query['$or'] = [
        { title: { $regex: queryObj.search, $options: 'i' } },
        { description: { $regex: queryObj.search, $options: 'i' } },
        { task: { $regex: queryObj.search, $options: 'i' } },
        { schedule: { $regex: queryObj.search, $options: 'i' } }
      ];
    }
    return await this.jobModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async getJobById(id: string): Promise<Job | null> {
    return await this.jobModel
      .findById(id)
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async publish(id: string, publishCondition = PublishConditions.PUBLIC): Promise<Job | null> {
    return await this.jobModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isPublished: publishCondition
          }
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }

  public async publishCancel(id: string, publishCondition = PublishConditions.PRIVATE): Promise<Job | null> {
    return await this.jobModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isPublished: publishCondition
          }
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('employmentTypes', 'id name')
      .populate('specializationCategories', 'id name')
      .populate('workStyles', 'id name')
      .populate('requirements.workExperience', 'id name')
      .populate('requirements.skills', 'id name')
      .populate('employer.legalForm', 'id name');
  }
}
