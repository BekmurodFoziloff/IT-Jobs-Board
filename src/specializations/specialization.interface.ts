import { Document } from 'mongoose';
import { User } from '../users/user.interface';
import { SpecializationCategory } from '../specializationCategories/specializationCategory.interface';

export interface Specialization extends Document {
    id: string;
    name: string;
    owner: User;
    specializationCategory: SpecializationCategory;
    createdAt?: string;
    updatedAt?: string;
}