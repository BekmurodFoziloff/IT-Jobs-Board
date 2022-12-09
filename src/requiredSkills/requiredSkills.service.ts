import RequiredSkillModel from './requiredSkill.model';
import { CreateRequiredSkillDto } from './dto/createRequiredSkill.dto';
import { UpdateRequiredSkillDto } from './dto/updateRequiredSkill.dto';
import { RequiredSkill } from './requiredSkill.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class RequiredSkillsService {
    private requiredSkillModel = RequiredSkillModel;

    public async findRequiredSkillById(id: string): Promise<RequiredSkill | null> {
        return await this.requiredSkillModel.findById(id)
            .populate('owner', '-password -createdAt');
    }

    public async findAllRequiredSkills(): Promise<RequiredSkill[]> {
        return await this.requiredSkillModel.find({})
            .populate('owner', '-password -createdAt');
    }

    public async createRequiredSkill(requiredSkill: CreateRequiredSkillDto, owner: User): Promise<RequiredSkill> {
        const newRequiredSkill = await this.requiredSkillModel.create({
            ...requiredSkill,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newRequiredSkill.save();
        await newRequiredSkill.populate('owner', '-password -createdAt');
        return newRequiredSkill;
    }

    public async deleteRequiredSkill(id: string): Promise<RequiredSkill | null> {
        return await this.requiredSkillModel.findByIdAndDelete(id)
            .populate('owner', '-password -createdAt');
    }

    public async updateRequiredSkill(id: string, requiredSkill: UpdateRequiredSkillDto): Promise<RequiredSkill | null> {
        return await this.requiredSkillModel.findByIdAndUpdate(
            id,
            {
                ...requiredSkill,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password -createdAt');
    }

    public async findRequiredSkillByName(name: string): Promise<RequiredSkill | null> {
        return await this.requiredSkillModel.findOne({ name });
    }
}