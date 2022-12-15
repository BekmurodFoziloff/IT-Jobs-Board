import { Schema, model } from 'mongoose';
import { Conditions } from '../utils/enums/condition.enum';
import { Job } from './job.interface';

const JobRequirementsSchema = new Schema({
    minAge: {
        type: Number,
        min: 16
    },
    maxAge: {
        type: Number,
        max: 99
    },
    workExperience: {
        type: Schema.Types.ObjectId,
        ref: 'WorkExperience',
        required: true
    },
    additationRequirements: {
        type: String
    },
    requiredSkills: [
        {
            type: Schema.Types.ObjectId,
            ref: 'RequiredSkill'
        }
    ]
});

const GeneralInformationAboutTheEmployerSchema = new Schema({
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

const JobSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
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
        jobRequirements: JobRequirementsSchema,
        generalInformationAboutTheEmployer: GeneralInformationAboutTheEmployerSchema,
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
    }
);

JobSchema.pre('validate', function(next) {
    if (new Date(`${this.toDate}`).getTime() > new Date().getTime()) {
        next();
    }
    next(new Error(`toDate with date ${this.toDate} must be future`));
});

JobSchema.index({ toDate: 1 }, { expireAfterSeconds: 0 }); // auto delete JobSchema data

const JobModel = model<Job>('Job', JobSchema);

export default JobModel;