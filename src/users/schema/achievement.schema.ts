import { Schema } from 'mongoose';

export const AchievementSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  issuedBy: {
    type: String
  },
  issuedDate: {
    type: Date
  },
  description: {
    type: String
  }
});

export default AchievementSchema;
