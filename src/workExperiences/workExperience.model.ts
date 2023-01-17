import { model } from 'mongoose';
import { WorkExperience } from './workExperience.interface';
import WorkExperienceSchema from './workExperience.schema';

const WorkExperienceModel = model<WorkExperience>('WorkExperience', WorkExperienceSchema);

export default WorkExperienceModel;
