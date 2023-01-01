import { Schema, model } from 'mongoose';
import { SpecializationBPO } from './specializationBPO.interface';

const SpecializationsBPOSchema = new Schema(
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

const SpecializationsBPOModel = model<SpecializationBPO>('SpecializationsBPO', SpecializationsBPOSchema);

export default SpecializationsBPOModel;