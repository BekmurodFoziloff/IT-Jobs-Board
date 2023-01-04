import { Schema, model } from 'mongoose';
import { Skill } from './skill.interface';

const SkillSchema = new Schema(
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

const SkillModel = model<Skill>('Skill', SkillSchema);

export default SkillModel;