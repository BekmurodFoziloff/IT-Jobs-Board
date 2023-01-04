import SkillModel from './skill.model';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import { Skill } from './skill.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class SkillsService {
    private skillModel = SkillModel;

    public async findSkillById(id: string): Promise<Skill | null> {
        return await this.skillModel.findById(id)
            .populate('owner', '-password');
    }

    public async findAllSkills(): Promise<Skill[]> {
        return await this.skillModel.find({})
            .populate('owner', '-password');
    }

    public async createSkill(skill: CreateSkillDto, owner: User): Promise<Skill> {
        const newSkill = await this.skillModel.create({
            ...skill,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newSkill.save();
        await newSkill.populate('owner', '-password');
        return newSkill;
    }

    public async deleteSkill(id: string): Promise<Skill | null> {
        return await this.skillModel.findByIdAndDelete(id)
            .populate('owner', '-password');
    }

    public async updateSkill(id: string, skill: UpdateSkillDto): Promise<Skill | null> {
        return await this.skillModel.findByIdAndUpdate(
            id,
            {
                ...skill,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password');
    }

    public async findSkillByName(name: string): Promise<Skill | null> {
        return await this.skillModel.findOne({ name });
    }
}