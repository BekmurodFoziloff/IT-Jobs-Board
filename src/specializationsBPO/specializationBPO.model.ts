import { model } from 'mongoose';
import { SpecializationBPO } from './specializationBPO.interface';
import SpecializationBPOSchema from './specializationBPO.schema';

const SpecializationBPOModel = model<SpecializationBPO>('SpecializationBPO', SpecializationBPOSchema);

export default SpecializationBPOModel;
