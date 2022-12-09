import { Schema, model } from 'mongoose';
import { EmploymentType } from './employmentType.interface';

const EmploymentTypeSchema = new Schema(
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

const EmploymentTypeModel = model<EmploymentType>('EmploymentType', EmploymentTypeSchema);

export default EmploymentTypeModel;