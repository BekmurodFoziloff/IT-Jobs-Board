import { model } from 'mongoose';
import { JobApplication } from './jobApplication.interface';
import JobApplicationSchema from './jobApplication.schema';

const JobApplicationModel = model<JobApplication>('JobApplication', JobApplicationSchema);

export default JobApplicationModel;
