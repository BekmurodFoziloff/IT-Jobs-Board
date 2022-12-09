import { Schema, model } from 'mongoose';
import { RequiredSkill } from './requiredSkill.interface';

const RequiredSkillSchema = new Schema(
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

const RequiredSkillModel = model<RequiredSkill>('RequiredSkill', RequiredSkillSchema);

export default RequiredSkillModel;