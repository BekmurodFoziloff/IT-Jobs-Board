import { Schema, model } from 'mongoose';
import { Region } from './region.interface';

const RegionSchema = new Schema(
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

const RegionModel = model<Region>('Region', RegionSchema);

export default RegionModel;