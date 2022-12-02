import { Document } from 'mongoose';

export interface User extends Document {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;
    createdAt?: string,
}