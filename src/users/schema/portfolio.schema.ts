import { Schema } from 'mongoose';

export const PortfolioSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  customer: {
    type: String
  },
  completionDate: {
    type: Date
  },
  link: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  image1: {
    type: String
  },
  image2: {
    type: String
  }
});

export default PortfolioSchema;
