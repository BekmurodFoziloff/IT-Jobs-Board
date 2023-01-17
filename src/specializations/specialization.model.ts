import { model } from 'mongoose';
import { Specialization } from './specialization.interface';
import SpecializationSchema from './specialization.schema';

const SpecializationModel = model<Specialization>('Specialization', SpecializationSchema);

export default SpecializationModel;
