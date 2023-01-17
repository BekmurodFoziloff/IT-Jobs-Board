import { Schema } from 'mongoose';
import ContactsSchema from './contacts.schema';
import BPOSchema from './BPO.schema';
import PortfolioSchema from './portfolio.schema';
import TeamSchema from './team.schema';
import { Conditions } from '../../utils/enums/condition.enum';

export const CompanySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  legalForm: {
    type: Schema.Types.ObjectId,
    ref: 'LegalForm',
    required: true
  },
  establishedYear: {
    type: Number
  },
  taxPayerId: {
    type: String,
    reuqired: true
  },
  industries: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Industry'
    }
  ],
  specializations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Specialization',
      required: true
    }
  ],
  location: {
    type: String
  },
  geoLocation: {
    type: String
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  },
  aboutCompany: {
    type: String
  },
  logo: {
    type: String
  },
  contacts: ContactsSchema,
  bpo: [BPOSchema],
  portfolios: [PortfolioSchema],
  teams: [TeamSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  condition: {
    type: String,
    enum: Conditions,
    required: true,
    default: Conditions.PRIVATE
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
});

export default CompanySchema;
