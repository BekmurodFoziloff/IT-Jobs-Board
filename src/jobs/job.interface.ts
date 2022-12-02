import { Document } from 'mongoose';
import { User } from '../users/user.interface';

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
    user: User;
    createdAt?: string;
    updatedAt?: string;
}