import { Schema, model } from 'mongoose';
import { WorkExperience } from './workExperience.interface';

const WorkExperienceSchema = new Schema(
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

const WorkExperienceModel = model<WorkExperience>('WorkExperience', WorkExperienceSchema);

export default WorkExperienceModel;