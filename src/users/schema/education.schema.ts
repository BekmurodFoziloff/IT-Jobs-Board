import { Schema } from 'mongoose';

export const EducationSchema = new Schema({
  school: {
    type: String,
    required: true
  },
  dagree: {
    type: String
  },
  fieldOfStudy: {
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
  },
  comments: {
    type: String
  }
});

export default EducationSchema;
