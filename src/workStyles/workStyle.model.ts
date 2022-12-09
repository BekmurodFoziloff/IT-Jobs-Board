import { Schema, model } from 'mongoose';
import { WorkStyle } from './workStyle.interface';

const WorkStyleSchema = new Schema(
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

const WorkStyleModel = model<WorkStyle>('WorkStyle', WorkStyleSchema);

export default WorkStyleModel;