import { Schema } from 'mongoose';

export const LegalFormSchema = new Schema({
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
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
});

export default LegalFormSchema;
