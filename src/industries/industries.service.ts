import IndustryModel from './industry.model';
import { CreateIndustryDto } from './dto/createIndustry.dto';
import { UpdateIndustryDto } from './dto/updateIndustry.dto';
import { Industry } from './industry.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class IndustriesService {
    private industryModel = IndustryModel;

    public async findIndustryById(id: string): Promise<Industry | null> {
        return await this.industryModel.findById(id)
            .populate('owner', '-password');
    }

    public async findAllIndustries(): Promise<Industry[]> {
        return await this.industryModel.find({})
            .populate('owner', '-password');
    }

    public async createIndustry(industry: CreateIndustryDto, owner: User): Promise<Industry> {
        const newIndustry = await this.industryModel.create({
            ...industry,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newIndustry.save();
        await newIndustry.populate('owner', '-password');
        return newIndustry;
    }

    public async deleteIndustry(id: string): Promise<Industry | null> {
        return await this.industryModel.findByIdAndDelete(id)
            .populate('owner', '-password');
    }

    public async updateIndustry(id: string, industry: UpdateIndustryDto): Promise<Industry | null> {
        return await this.industryModel.findByIdAndUpdate(
            id,
            {
                ...industry,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password');
    }

    public async findIndustryByName(name: string): Promise<Industry | null> {
        return await this.industryModel.findOne({ name });
    }
}