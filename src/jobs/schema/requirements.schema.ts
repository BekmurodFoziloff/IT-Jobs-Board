import { Schema } from 'mongoose';

export const RequirementsSchema = new Schema({
  minAge: {
    type: Number
  },
  maxAge: {
    type: Number
  },
  workExperience: {
    type: Schema.Types.ObjectId,
    ref: 'WorkExperience',
    required: true
  },
  additionalRequirements: {
    type: String
  },
  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }
  ]
});

export default RequirementsSchema;
