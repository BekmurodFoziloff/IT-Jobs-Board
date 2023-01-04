import { Schema, model } from 'mongoose';
import { Company } from './company.interface';
import { Conditions } from '../utils/enums/condition.enum';

const ContactsSchema = new Schema(
    {
        website: {
            type: String
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        additionalPhone: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        linkedLn: {
            type: String
        }
    }
);

const BPOSchema = new Schema(
    {
        isCompanyBPO: {
            type: Boolean,
            default: false
        },
        specializationsBPO: [
            {
                type: Schema.Types.ObjectId,
                ref: 'SpecializationBPO',
                required: true
            }
        ]
    }
);

const PortfolioSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        customer: {
            type: Date
        },
        completionDateMonth: {
            type: String
        },
        completionDateYear: {
            type: Number
        },
        link: {
            type: String
        },
        image: {
            type: String,
            required: true
        },
        image1: {
            type: String
        },
        image2: {
            type: String
        }
    }
);

const TeamSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        },
        experience: {
            type: String
        }
    }
);

const CompanySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        legalForm: {
            type: Schema.Types.ObjectId,
            ref: 'LegalForm',
            required: true
        },
        establishedYear: {
            type: Number
        },
        taxPayerId: {
            type: String,
            reuqired: true
        },
        industries: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Industry'
            }
        ],
        specializations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Specialization',
                required: true
            }
        ],
        location: {
            type: String
        },
        geoLocation: {
            type: String
        },
        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true
        },
        aboutCompany: {
            type: String
        },
        logo: {
            type: String
        },
        contacts: ContactsSchema,
        bpo: [
            BPOSchema
        ],
        portfolios: [
            PortfolioSchema
        ],
        teams: [
            TeamSchema
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true
        },
        condition: {
            type: String,
            enum: Conditions,
            required: true,
            default: Conditions.PRIVATE
        },
        createdAt: {
            type: String
        },
        updatedAt: {
            type: String
        }
    }
);

const CompanyModel = model<Company>('Company', CompanySchema);

export default CompanyModel;