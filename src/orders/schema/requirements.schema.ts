import { Schema } from 'mongoose';

export const RequirementsSchema = new Schema({
  transactionType: {
    type: String
  },
  requirementsToTheExecutor: {
    type: String
  },
  comments: {
    type: String
  }
});

export default RequirementsSchema;
