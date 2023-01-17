import { model } from 'mongoose';
import { WorkStyle } from './workStyle.interface';
import WorkStyleSchema from './workStyle.schema';

const WorkStyleModel = model<WorkStyle>('WorkStyle', WorkStyleSchema);

export default WorkStyleModel;
