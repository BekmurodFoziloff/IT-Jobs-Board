import { Document } from 'mongoose';
import { Specialization } from '../specializations/specialization.interface';
import { User } from '../users/user.interface';

interface GeneralInformationAboutTheProject extends Document {
    id: string;
    title: string;
    description: string;
    deadline: Date;
    comments: string;
    attachedFile: string;
}

interface GeneralRequirementsToTheExecutor extends Document {
    id: string;
    expectedTransactionType: string;
    requirementsToTheExecutor: string;
    commentsToTheRequirements: string;
}

interface ContactInformation extends Document {
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
    project: GeneralInformationAboutTheProject;
    requirement: GeneralRequirementsToTheExecutor;
    contact: ContactInformation;
    owner: User;
    condition: string;
    createdAt?: string;
    updatedAt   ?   :       s   t   r   i   n   g   ;   
    }                                                       