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
            .populate('owner', 'email firstName lastName id');
    }

    public async findAllWorkExperiences(): Promise<WorkExperience[]> {
        return await this.workExperienceModel.find({})
            .populate('owner', 'email firstName lastName id');
    }

    public async createWorkExperience(workExperience: CreateWorkExperienceDto, owner: User): Promise<WorkExperience> {
        const newWorkExperience = await this.workExperienceModel.create({
            ...workExperience,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newWorkExperience.save();
        await newWorkExperience.populate('owner', 'email firstName lastName id');
        return newWorkExperience;
    }

    public async deleteWorkExperience(id: string): Promise<WorkExperience | null> {
        return await this.workExperienceModel.findByIdAndDelete(id)
            .populate('owner', 'email firstName lastName id');
    }

    public async updateWorkExperience(id: string, workExperience: UpdateWorkExperienceDto): Promise<WorkExperience | null> {
        return await this.workExperienceModel.findByIdAndUpdate(
            id,
            {
                ...workExperience,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id');
    }

    public async findWorkExperienceByName(name: string): Promise<WorkExperience | null> {
        return await this.workExperienceModel.findOne({ name });
    }
}