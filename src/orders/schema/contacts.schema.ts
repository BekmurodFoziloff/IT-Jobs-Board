import { Schema } from 'mongoose';

export const ContactsSchema = new Schema({
  customerWebsite: {
    type: String
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  customerPhoneNumber: {
    type: String,
    required: true
  },
  customerAddPhoneNumber: {
    type: String
  },
  contactPerson: {
    type: String
  },
  personEmail: {
    type: String,
    required: true
  },
  personAddress: {
    type: String,
    required: true
  },
  personPhoneNumber: {
    type: String,
    required: true
  },
  personAddPhoneNumber: {
    type: String
  }
});

export default ContactsSchema;
