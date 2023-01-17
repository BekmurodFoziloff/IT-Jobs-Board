import SpecializationModel from './specialization.model';
import { CreateSpecializationDto } from './dto/createSpecialization.dto';
import { UpdateSpecializationDto } from './dto/updateSpecialization.dto';
import { Specialization } from './specialization.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class SpecializationsService {
  private specializationModel = SpecializationModel;

  public async findSpecializationById(id: string): Promise<Specialization | null> {
    return await this.specializationModel
      .findById(id)
      .populate('owner', 'email firstName lastName id')
      .populate('specializationCategory', 'id name');
  }

  public async findAllSpecializations(): Promise<Specialization[]> {
    return await this.specializationModel
      .find({})
      .populate('owner', 'email firstName lastName id')
      .populate('specializationCategory', 'id name');
  }

  public async createSpecialization(specialization: CreateSpecializationDto, owner: User): Promise<Specialization> {
    const newSpecialization = await this.specializationModel.create({
      ...specialization,
      owner,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    await newSpecialization.save();
    await newSpecialization.populate('owner', 'email firstName lastName id');
    return newSpecialization;
  }

  public async updateSpecialization(
    id: string,
    specialization: UpdateSpecializationDto
  ): Promise<Specialization | null> {
    return await this.specializationModel
      .findByIdAndUpdate(
        id,
        {
          ...specialization,
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('specializationCategory', 'id name');
  }

  public async deleteSpecialization(id: string): Promise<Specialization | null> {
    return await this.specializationModel
      .findByIdAndDelete(id)
      .populate('owner', 'email firstName lastName id')
      .populate('specializationCategory', 'id name');
  }

  public async findSpecializationByName(name: string): Promise<Specialization | null> {
    return await this.specializationModel.findOne({ name });
  }
}
