import { Schema } from 'mongoose';
import ProfileSchema from './profile.schema';
import ContactsSchema from './contacts.schema';
import WorkExperienceSchema from './workExperience.schema';
import EducationSchema from './education.schema';
import AchievementSchema from './achievement.schema';
import PortfolioSchema from './portfolio.schema';
import { PublishConditions } from '../../utils/enums/publishCondition.enum';
import { Roles } from '../../utils/enums/role.enum';

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Roles,
      required: true,
      default: Roles.USER
    },
    profile: ProfileSchema,
    contacts: ContactsSchema,
    workExperiences: [WorkExperienceSchema],
    educations: [EducationSchema],
    achievements: [AchievementSchema],
    portfolios: [PortfolioSchema],
    isPublished: {
      type: String,
      enum: PublishConditions,
      required: true,
      default: PublishConditions.PRIVATE
    },
    currentHashedRefreshToken: {
      type: String
    },
    emailConfirmationToken: {
      type: String
    },
    emailConfirmationTokenExpire: {
      type: Date
    },
    resetPasswordConfirmationToken: {
      type: String
    },
    resetPasswordConfirmationTokenExpire: {
      type: Date
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: String
    },
    updatedAt: {
      type: String
    }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.index({ confirmTokenExpire: 1 }, { expireAfterSeconds: 0 }); // auto delete UserSchema data

export default UserSchema;
