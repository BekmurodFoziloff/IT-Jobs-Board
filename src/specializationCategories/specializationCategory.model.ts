import { Schema, model } from 'mongoose';
import { SpecializationCategory } from './specializationCategory.interface';

const SpecializationCategorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: String
        },
        updatedAt: {
            type: String
        }
    }
);

const SpecializationCategoryModel = model<SpecializationCategory>('SpecializationCategory', SpecializationCategorySchema);

export default SpecializationCategoryModel;