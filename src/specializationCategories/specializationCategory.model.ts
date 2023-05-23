import { model } from 'mongoose';
import { SpecializationCategory } from './specializationCategory.interface';
import SpecializationCategorySchema from './specializationCategory.schema';

const SpecializationCategoryModel = model<SpecializationCategory>(
  'SpecializationCategory',
  SpecializationCategorySchema
);

export default SpecializationCategoryModel;
