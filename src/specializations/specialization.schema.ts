import { Schema } from 'mongoose';

export const SpecializationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specializationCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SpecializationCategory',
    required: true
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
});

export default SpecializationSchema;
