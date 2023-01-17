import { model } from 'mongoose';
import { Region } from './region.interface';
import RegionSchema from './region.schema';

const RegionModel = model<Region>('Region', RegionSchema);

export default RegionModel;
