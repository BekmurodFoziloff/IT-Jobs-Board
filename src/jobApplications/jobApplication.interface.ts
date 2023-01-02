import { Document } from 'mongoose';
import { User } from '../users/user.interface';

export interface JobApplication extends Document {
    id: string;
    fullName: string;
    phoneNumber: User;
    birthDate: Date;
    resume: string;
    experience: string;
    gender: string;
    jobOwner: string;
    createdAt?: string;
}