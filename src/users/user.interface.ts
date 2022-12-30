import { Document } from 'mongoose';
import { EmploymentType } from '../employmentTypes/employmentType.interface';
import { Region } from '../regions/region.interface';
import { RequiredSkill } from '../requiredSkills/requiredSkill.interface';
import { SpecializationCategory } from '../specializationCategories/specializationCategory.interface';

interface GeneralInformationUser extends Document {
    id: string;
    photo: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    position: string;
    region: Region;
    aboutMe: string;
    skills: RequiredSkill[];
    specializationCategories: SpecializationCategory[];
}

interface Contacts extends Document {
    id: string;
    website: string;
    email: string;
    phone: string;
    additionalPhone: string;
    facebook: string;
    twitter: string;
    linkedLn: string;
}

interface WorkExperience extends Document {
    id: string;
    title: string;
    employmentTypes: EmploymentType[];
    company: string;
    startDateMonth: string;
    startDateYear: number
    endDateMonth: string;
    endDateYear: number;
}

interface Education extends Document {
    id: string;
    school: string;
    dagree: string;
    fieldOfStudy: string;
    startDateMonth: string;
    startDateYear: number;
    endDateMonth: string;
    endDateYear: number;
    comments: string;
}

interface Achievement extends Document {
    id: string;
    title: string;
    issuedBy: string;
    issuedDate: Date;
    description: string;
}

interface GeneralInformationAboutTheProject extends Document {
    id: string;
    title: string;
    description: string;
    customer: string;
    completionDate: Date;
    link: string;
    image: string;
    image1: string;
    image2: string;
}

export interface User extends Document {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    profile: GeneralInformationUser;
    contacts: Contacts;
    workExperiences: WorkExperience[];
    educations: Education[];
    achievements: Achievement[];
    portfolios: GeneralInformationAboutTheProject[];
    condition: string;
    createdAt: string;
    updatedAt: string;
}