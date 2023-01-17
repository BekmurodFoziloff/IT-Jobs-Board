import { model } from 'mongoose';
import { SpecializationCategory } from './specializationCategory.interface';
import SpecializationCategorySchema from './SpecializationCategory.schema';

const SpecializationCategoryModel = model<SpecializationCategory>(
  'SpecializationCategory',
  SpecializationCategorySchema
);

export default SpecializationCategoryModel;
