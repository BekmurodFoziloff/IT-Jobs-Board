import { Schema } from 'mongoose';

export const EmployerSchema = new Schema({
  companyName: {
    type: String,
    required: true
  },
  legalForm: {
    type: Schema.Types.ObjectId,
    ref: 'LegalForm',
    required: true
  },
  companyWebsite: {
    type: String
  },
  companyContactPerson: {
    type: String,
    required: true
  },
  companyContactEmail: {
    type: String,
    required: true
  },
  companyContactPhoneNumber: {
    type: String,
    required: true
  },
  companyContactAddress: {
    type: String
  },
  comments: {
    type: String
  }
});

export default EmployerSchema;
