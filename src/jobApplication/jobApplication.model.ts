import { Schema, model } from 'mongoose';
import { JobApplication } from './jobApplication.interface';

const JobApplicationSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        },
        resume: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        jobOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: String
        },
        updatedAt: {
            type: String
        }
    }
);

const JobApplicationModel = model<JobApplication>('JobApplication', JobApplicationSchema);

export default JobApplicationModel;