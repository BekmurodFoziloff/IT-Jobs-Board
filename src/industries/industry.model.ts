import { model } from 'mongoose';
import { Industry } from './industry.interface';
import IndustrySchema from './industry.schema';

const IndustryModel = model<Industry>('Industry', IndustrySchema);

export default IndustryModel;
