import { Document } from 'mongoose';
import { Specialization } from '../specializations/specialization.interface';
import { User } from '../users/user.interface';

interface Project extends Document {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  comments: string;
  attachedFile: string;
}

interface Requirements extends Document {
  id: string;
  transactionType: string;
  requirementsToTheExecutor: string;
  comments: string;
}

interface Contacts extends Document {
  id: string;
  customerWebsite: string;
  customerEmail: string;
  customerAddress: string;
  customerPhoneNumber: string;
  customerAddPhoneNumber: string;
  contactPerson: string;
  personEmail: string;
  personAddress: string;
  personPhoneNumber: string;
  personAddPhoneNumber: string;
}

export interface Order extends Document {
  id: string;
  customer: string;
  customerType: string;
  applicationsOpen: Date;
  applicationsClose: Date;
  minBudget: number;
  maxBudget: number;
  currency: string;
  negotiable: string;
  filingConditions: string;
  specializations: Specialization[];
  project: Project;
  requirements: Requirements;
  contacts: Contacts;
  owner: User;
  condition: string;
  createdAt?: string;
  updatedAt?: string;
}
