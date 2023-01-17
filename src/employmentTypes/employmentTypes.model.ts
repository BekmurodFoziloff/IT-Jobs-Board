import { model } from 'mongoose';
import { EmploymentType } from './employmentType.interface';
import EmploymentTypeSchema from './employmentType.schema';

const EmploymentTypeModel = model<EmploymentType>('EmploymentType', EmploymentTypeSchema);

export default EmploymentTypeModel;
