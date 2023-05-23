import { Schema } from 'mongoose';
import RequirementsSchema from './requirements.schema';
import EmployerSchema from './employer.schema';
import { PublishConditions } from '../../utils/enums/publishCondition.enum';

export const JobSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tasks: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  employmentTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'EmploymentType',
      required: true
    }
  ],
  workStyles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WorkStyle',
      required: true
    }
  ],
  minSalary: {
    type: Number
  },
  maxSalary: {
    type: Number
  },
  currency: {
    type: String,
    required: true
  },
  specializationCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SpecializationCategory',
      required: true
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toDate: {
    type: Date
  },
  requirements: RequirementsSchema,
  employer: EmployerSchema,
  isPublished: {
    type: String,
    enum: PublishConditions,
    required: true,
    default: PublishConditions.PRIVATE
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
});

JobSchema.pre('validate', function (next) {
  if (new Date(`${this.toDate}`).getTime() > new Date().getTime()) {
    next();
  }
  next(new Error(`toDate with date ${this.toDate} must be future`));
});

export default JobSchema;
