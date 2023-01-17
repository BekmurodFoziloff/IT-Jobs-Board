import { model } from 'mongoose';
import { Company } from './company.interface';
import CompanySchema from './schema/company.schema';

const CompanyModel = model<Company>('Company', CompanySchema);

export default CompanyModel;
