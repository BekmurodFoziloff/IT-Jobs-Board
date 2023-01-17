import SpecializationCategoryModel from './specializationCategory.model';
import { CreateSpecializationCategoryDto } from './dto/createSpecializationCategory.dto';
import { UpdateSpecializationCategoryDto } from './dto/updateSpecializationCategory.dto';
import { SpecializationCategory } from './specializationCategory.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class SpecializationCategoriesService {
  private specializationCategoryModel = SpecializationCategoryModel;

  public async findSpecializationCategoryById(id: string): Promise<SpecializationCategory | null> {
    return await this.specializationCategoryModel.findById(id).populate('owner', 'email firstName lastName id');
  }

  public async findAllSpecializationCategories(): Promise<SpecializationCategory[]> {
    return await this.specializationCategoryModel.find({}).populate('owner', 'email firstName lastName id');
  }

  public async createSpecializationCategory(
    specializationCategory: CreateSpecializationCategoryDto,
    owner: User
  ): Promise<SpecializationCategory> {
    const newSpecializationCategory = await this.specializationCategoryModel.create({
      ...specializationCategory,
      owner,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    await newSpecializationCategory.save();
    await newSpecializationCategory.populate('owner', 'email firstName lastName id');
    return newSpecializationCategory;
  }

  public async updateSpecializationCategory(
    id: string,
    specializationCategory: UpdateSpecializationCategoryDto
  ): Promise<SpecializationCategory | null> {
    return await this.specializationCategoryModel
      .findByIdAndUpdate(
        id,
        {
          ...specializationCategory,
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id');
  }

  public async deleteSpecializationCategory(id: string): Promise<SpecializationCategory | null> {
    return await this.specializationCategoryModel
      .findByIdAndDelete(id)
      .populate('owner', 'email firstName lastName id');
  }

  public async findSpecializationCategoryByName(name: string): Promise<SpecializationCategory | null> {
    return await this.specializationCategoryModel.findOne({ name });
  }
}
