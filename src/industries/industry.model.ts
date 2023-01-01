import { Schema, model } from 'mongoose';
import { Industry } from './industry.interface';

const IndustrySchema = new Schema(
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

const IndustryModel = model<Industry>('Industry', IndustrySchema);

export default IndustryModel;