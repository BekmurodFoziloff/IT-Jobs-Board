import { Document } from 'mongoose';
import { User } from '../users/user.interface';
import { SpecializationCategory } from '../specializationCategories/specializationCategory.interface';
import { Skill } from '../skills/skill.interface';
import { WorkExperience } from '../workExperiences/workExperience.interface';
import { EmploymentType } from '../employmentTypes/employmentType.interface';
import { WorkStyle } from '../workStyles/workStyle.interface';
import { LegalForm } from '../legalForms/legalForm.interface';

interface Requiremets extends Document {
  id: string;
  minAge: number;
  maxAge: number;
  workExperience: WorkExperience;
  additionalRequirements: string;
  skills: Skill[];
}

interface Employer extends Document {
  id: string;
  companyName: string;
  legalForm: LegalForm;
  companyWebsite: string;
  companyContactPerson: string;
  companyContactEmail: string;
  companyContactPhoneNumber: string;
  companyContactAddress: string;
  comments: string;
}

export interface Job extends Document {
  id: string;
  title: string;
  description: string;
  tasks: string;
  schedule: string;
  employmentTypes: EmploymentType[];
  workStyles: WorkStyle[];
  minSalary: number;
  maxSalary: number;
  currency: string;
  specializationCategories: SpecializationCategory[];
  toDate: Date;
  owner: User;
  createdAt?: string;
  updatedAt?: string;
  requirements: Requiremets;
  employer: Employer;
  isPublished: string;
}
