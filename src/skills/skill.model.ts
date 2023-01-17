import { model } from 'mongoose';
import { Skill } from './skill.interface';
import SkillSchema from './skill.schema';

const SkillModel = model<Skill>('Skill', SkillSchema);

export default SkillModel;
