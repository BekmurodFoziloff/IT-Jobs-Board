import { Schema, model } from 'mongoose';
import { User } from './user.interface';
import { Roles } from '../utils/enums/role.enum';
import { Conditions } from '../utils/enums/condition.enum';

const ProfileSchema = new Schema(
    {
        photo: {
            type: String
        },
        firstName: {
            type: String,
            required: true
        },
        middleName: {
            type: String
        },
        lastName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true
        },
        aboutMe: {
            type: String
        },
        skills: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Skill'
            }
        ],
        specializationCategories: [
            {
                type: Schema.Types.ObjectId,
                ref: 'SpecializationCategory',
                required: true
            }
        ]
    }
);

const ContactsSchema = new Schema(
    {
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
    }
);

const WorkExperienceSchema = new Schema(
    {
        title: {
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
        company: {
            type: String
        },
        startDateMonth: {
            type: String,
            required: true
        },
        startDateYear: {
            type: Number,
            required: true
        },
        endDateMonth: {
            type: String
        },
        endDateYear: {
            type: Number
        }
    }
);

const EducationSchema = new Schema(
    {
        school: {
            type: String,
            required: true
        },
        dagree: {
            type: String
        },
        fieldOfStudy: {
            type: String
        },
        startDateMonth: {
            type: String,
            required: true
        },
        startDateYear: {
            type: Number,
            required: true
        },
        endDateMonth: {
            type: String
        },
        endDateYear: {
            type: Number
        },
        comments: {
            type: String
        }
    }
);

const AchievementSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        issuedBy: {
            type: String
        },
        issuedDate: {
            type: Date
        },
        description: {
            type: String
        }
    }
);

const PortfolioSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        customer: {
            type: Date
        },
        completionDate: {
            type: String
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
    }
);

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
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
        workExperiences: [
            WorkExperienceSchema
        ],
        educations: [
            EducationSchema
        ],
        achievements: [
            AchievementSchema
        ],
        portfolios: [
            PortfolioSchema
        ],
        condition: {
            type: String,
            enum: Conditions,
            required: true,
            default: Conditions.PRIVATE
        },
        currentHashedRefreshToken: {
            type: String
        },
        createdAt: {
            type: String
        },
        updatedAt: {
            type: String
        }
    }
);

const UserModel = model<User>('User', UserSchema);

export default UserModel;