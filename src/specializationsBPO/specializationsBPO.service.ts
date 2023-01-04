import SpecializationBPOModel from './specializationBPO.model';
import { CreateSpecializationBPODto } from './dto/createSpecializationBPO.dto';
import { UpdateSpecializationBPODto } from './dto/updateSpecializationBPO.dto';
import { SpecializationBPO } from './specializationBPO.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class SpecializationsBPOService {
    private specializationBPOModel = SpecializationBPOModel;

    public async findSpecializationBPOById(id: string): Promise<SpecializationBPO | null> {
        return await this.specializationBPOModel.findById(id)
            .populate('owner', 'email firstName lastName id');
    }

    public async findAllSpecializationsBPO(): Promise<SpecializationBPO[]> {
        return await this.specializationBPOModel.find({})
            .populate('owner', 'email firstName lastName id');
    }

    public async createSpecializationBPO(specializationBPO: CreateSpecializationBPODto, owner: User): Promise<SpecializationBPO> {
        const newSpecializationBPO = await this.specializationBPOModel.create({
            ...specializationBPO,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newSpecializationBPO.save();
        await newSpecializationBPO.populate('owner', 'email firstName lastName id');
        return newSpecializationBPO;
    }

    public async deleteSpecializationBPO(id: string): Promise<SpecializationBPO | null> {
        return await this.specializationBPOModel.findByIdAndDelete(id)
            .populate('owner', 'email firstName lastName id');
    }

    public async updateSpecializationBPO(id: string, specializationBPO: UpdateSpecializationBPODto): Promise<SpecializationBPO | null> {
        return await this.specializationBPOModel.findByIdAndUpdate(
            id,
            {
                ...specializationBPO,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }, 
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id');
    }

    public async findSpecializationBPOByName(name: string): Promise<SpecializationBPO | null> {
        return await this.specializationBPOModel.findOne({ name });
    }
}