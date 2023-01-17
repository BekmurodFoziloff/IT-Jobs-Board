import { Document } from 'mongoose';
import { User } from '../users/user.interface';

export interface JobApplication extends Document {
  id: string;
  fullName: string;
  phoneNumber: string;
  birthDate: Date;
  resume: string;
  experience: string;
  gender: string;
  jobOwner: User;
  createdAt?: string;
}
