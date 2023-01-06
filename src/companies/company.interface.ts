import { Document } from 'mongoose';
import { User } from '../users/user.interface';
import { SpecializationBPO } from '../specializationsBPO/specializationBPO.interface';
import { LegalForm } from '../legalForms/legalForm.interface';
import { Industry } from '../industries/industry.interface';
import { Specialization } from '../specializations/specialization.interface';
import { Region } from '../regions/region.interface';

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

interface BPO extends Document {
    id: string;
    isCompanyBPO: boolean;
    specializationsBPO: SpecializationBPO[];
}

interface Portfolio extends Document {
    id: string;
    title: string;
    description: string;
    customer: string;
    completionDateMonth: string;
    completionDateYear: number;
    link: string;
    image: string;
    image1: string;
    image2: string;
}

interface CompanyTeam extends Document {
    id: string;
    title: string;
    level: string;
    experience: string;
}

export interface Company extends Document {
    id: string;
    name: string;
    legalForm: LegalForm;
    establishedYear: number;
    taxPayerId: string;
    industries: Industry[];
    specializations: Specialization[];
    location: string;
    geoLocation: string;
    region: Region;
    aboutCompany: string;
    logo: string;
    contacts: Contacts;
    bpo: BPO[];
    portfolios: Portfolio[];
    teams: CompanyTeam[];
    owner: User;
    condition: string;
    createdAt?: string;
    updatedAt?: string;
}