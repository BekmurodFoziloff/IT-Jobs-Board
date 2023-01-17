import { Schema } from 'mongoose';

export const WorkExperienceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  employmentTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'EmploymentType',
      required: true
    }
  ],
  company: {
    type: String
  },
  startDateMonth: {
    type: String,
    required: true
  },
  startDateYear: {
    type: Number,
    required: true
  },
  endDateMonth: {
    type: String
  },
  endDateYear: {
    type: Number
  }
});

export default WorkExperienceSchema;
