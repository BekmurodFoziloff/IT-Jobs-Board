import { Schema } from 'mongoose';

export const ContactsSchema = new Schema({
  website: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  additionalPhone: {
    type: String
  },
  facebook: {
    type: String
  },
  twitter: {
    type: String
  },
  linkedLn: {
    type: String
  }
});

export default ContactsSchema;
