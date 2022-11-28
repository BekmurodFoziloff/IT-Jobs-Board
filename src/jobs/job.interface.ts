import { Document } from 'mongoose';

export interface Job extends Document {
    id: string;
    title: string;
    description: string;
    tasks: string;
    schedule: string;
    minAge: number;
    maxAge: number;
    additationRequirements: string;
    workStyle: string;
    salary: string;
    experience: string;
    employmentType: string;
    createdAt?: string;
    updatedAt?: string;
}