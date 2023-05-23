import { Schema } from 'mongoose';
import ProjectSchema from './project.schema';
import RequirementsSchema from './requirements.schema';
import ContactsSchema from './contacts.schema';
import { PublishConditions } from '../../utils/enums/publishCondition.enum';

export const OrderSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    customer: {
      type: String,
      required: true
    },
    customerType: {
      type: String,
      required: true
    },
    applicationsOpen: {
      type: Date,
      required: true
    },
    applicationsClose: {
      type: Date,
      required: true
    },
    minBudget: {
      type: Number
    },
    maxBudget: {
      type: Number
    },
    currency: {
      type: String,
      required: true
    },
    negotiable: {
      type: String
    },
    filingConditions: {
      type: String,
      required: true
    },
    specializations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Specialization',
        required: true
      }
    ],
    project: ProjectSchema,
    requirements: RequirementsSchema,
    contacts: ContactsSchema,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: String,
      enum: PublishConditions,
      default: PublishConditions.PRIVATE,
      required: true
    },
    createdAt: {
      type: String
    },
    updatedAt: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true }
  }
);

OrderSchema.virtual('status').get(function () {
  if (new Date(`${this.applicationsClose}`).getTime() > new Date().getTime()) {
    return 'open';
  } else if (new Date(`${this.applicationsClose}`).getTime() < new Date().getTime()) {
    return 'closed';
  }
});

OrderSchema.virtual('archived').get(function () {
  if (new Date(`${this.applicationsClose}`).getTime() > new Date().getTime()) {
    return false;
  } else if (new Date(`${this.applicationsClose}`).getTime() < new Date().getTime()) {
    return true;
  }
});

export default OrderSchema;
