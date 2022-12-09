import EmploymentTypeModel from './employmentTypes.model';
import { CreateEmploymentTypeDto } from './dto/createEmploymentType.dto';
import { UpdateEmploymentTypeDto } from './dto/updateEmploymentType.dto';
import { EmploymentType } from './employmentType.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class EmploymentTypesService {
    private employmentTypeModel = EmploymentTypeModel;

    public async findEmploymentTypeById(id: string): Promise<EmploymentType | null> {
        return await this.employmentTypeModel.findById(id)
            .populate('owner', '-password -createdAt');
    }

    public async findAllEmploymentTypes(): Promise<EmploymentType[]> {
        return await this.employmentTypeModel.find({})
            .populate('owner', '-password -createdAt');
    }

    public async createEmploymentType(employmentType: CreateEmploymentTypeDto, owner: User): Promise<EmploymentType> {
        const newEmploymentType = await this.employmentTypeModel.create({
            ...employmentType,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newEmploymentType.save();
        await newEmploymentType.populate('owner', '-password -createdAt');
        return newEmploymentType;
    }

    public async deleteEmploymentType(id: string): Promise<EmploymentType | null> {
        return await this.employmentTypeModel.findByIdAndDelete(id)
            .populate('owner', '-password -createdAt');
    }

    public async updateEmploymentType(id: string, employmentType: UpdateEmploymentTypeDto): Promise<EmploymentType | null> {
        return await this.employmentTypeModel.findByIdAndUpdate(
            id,
            {
                ...employmentType,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password -createdAt');
    }

    public async findEmploymentTypeByName(name: string): Promise<EmploymentType | null> {
        return await this.employmentTypeModel.findOne({ name });
    }
}