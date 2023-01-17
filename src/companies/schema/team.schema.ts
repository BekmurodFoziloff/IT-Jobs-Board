import { Schema } from 'mongoose';

export const TeamSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  experience: {
    type: String
  }
});

export default TeamSchema;
