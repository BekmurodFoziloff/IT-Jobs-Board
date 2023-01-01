import { Document } from 'mongoose';
import { User } from '../users/user.interface';

export interface Industry extends Document {
    id: string;
    name: string;
    owner: User;
    createdAt?: string;
    updatedAt?: string;
}