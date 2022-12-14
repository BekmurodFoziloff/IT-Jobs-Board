import { Document } from 'mongoose';
import { User } from '../users/user.interface';
import { SpecializationCategory } from '../specializationCategories/specializationCategory.interface';
import { RequiredSkill } from '../requiredSkills/requiredSkill.interface';
import { WorkExperience } from '../workExperiences/workExperience.interface';
import { EmploymentType } from '../employmentTypes/employmentType.interface';
import { WorkStyle } from '../workStyles/workStyle.interface';
import { LegalForm } from '../legalForms/legalForm.interface';

interface JobRequirements extends Document {
    minAge: number;
    maxAge: number;
    workExperience: WorkExperience;
    additationRequirements: string;
    requiredSkills: RequiredSkill[];
}

interface GeneralInformationAboutTheEmployer extends Document {
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
    specializationCategories: SpecializationCategory[];
    toDate: Date;
    owner: User;
    createdAt?: string;
    updatedAt?: string;
    jobRequirements: JobRequirements;
    generalInformationAboutTheEmployer: GeneralInformationAboutTheEmployer;
    condition: string;
}