import WorkExperienceModel from './workExperience.model';
import { CreateWorkExperienceDto } from './dto/createWorkExperience.dto';
import { UpdateWorkExperienceDto } from './dto/updateWorkExperience.dto';
import { WorkExperience } from './workExperience.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class WorkExperiencesService {
    private workExperienceModel = WorkExperienceModel;

    public async findWorkExperienceById(id: string): Promise<WorkExperience | null> {
        return await this.workExperienceModel.findById(id)
            .populate('owner', '-password -createdAt');
    }

    public async findAllWorkExperiences(): Promise<WorkExperience[]> {
        return await this.workExperienceModel.find({})
            .populate('owner', '-password -createdAt');
    }

    public async createWorkExperience(workExperience: CreateWorkExperienceDto, owner: User): Promise<WorkExperience> {
        const newWorkExperience = await this.workExperienceModel.create({
            ...workExperience,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newWorkExperience.save();
        await newWorkExperience.populate('owner', '-password -createdAt');
        return newWorkExperience;
    }

    public async deleteWorkExperience(id: string): Promise<WorkExperience | null> {
        return await this.workExperienceModel.findByIdAndDelete(id)
            .populate('owner', '-password -createdAt');
    }

    public async updateWorkExperience(id: string, workExperience: UpdateWorkExperienceDto): Promise<WorkExperience | null> {
        return await this.workExperienceModel.findByIdAndUpdate(
            id,
            {
                ...workExperience,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password -createdAt');
    }

    public async findWorkExperienceByName(name: string): Promise<WorkExperience | null> {
        return await this.workExperienceModel.findOne({ name });
    }
}