import { model } from 'mongoose';
import { Job } from './job.interface';
import JobSchema from './schema/job.schema';

const JobModel = model<Job>('Job', JobSchema);

export default JobModel;
