import { Schema } from 'mongoose';

export const JobApplicationSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  workExperience: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  jobOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: String
  }
});

export default JobApplicationSchema;
