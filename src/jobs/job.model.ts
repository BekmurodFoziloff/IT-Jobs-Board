import { Schema, model } from 'mongoose';
import { Job } from './job.interface';

export const JobSchema = new Schema(
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
        additationRequirements: {
            type: String
        },
        minAge: {
            type: Number
        },
        maxAge: {
            type: Number
        },
        workStyle: {
            type: String,
            required: true
        },
        minSalary: {
            type: Number
        },
        maxSalary: {
            type: Number
        },
        experience: {
            type: String,
            required: true
        },
        employmentType: {
            type: String,
            required: true
        },
        user: {
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

const JobModel = model<Job>('Job', JobSchema);

export default JobModel;