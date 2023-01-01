import { Schema, model } from 'mongoose';
import { Specialization } from './specialization.interface';

const SpecializationSchema = new Schema(
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
        specializationCategory: {
            type: Schema.Types.ObjectId,
            ref: 'SpecializationCategory',
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

const SpecializationModel = model<Specialization>('Specialization', SpecializationSchema);

export default SpecializationModel;