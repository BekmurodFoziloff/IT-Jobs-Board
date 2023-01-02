import { Schema, model } from 'mongoose';
import { Order } from './order.interface';
import { Conditions } from '../utils/enums/condition.enum';

const GeneralInformationAboutTheProjectSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        comments: {
            type: String
        },
        attachedFile: {
            type: String,
            required: true
        }
    }
)

const GeneralRequirementsToTheExecutorSchema = new Schema(
    {
        expectedTransactionType: {
            type: String
        },
        requirementsToTheExecutor: {
            type: String
        },
        commentsToTheRequirements: {
            type: String
        }
    }
)

const ContactInformationSchema = new Schema(
    {
        customerWebsite: {
            type: String
        },
        customerEmail: {
            type: String,
            required: true
        },
        customerAddress: {
            type: String,
            required: true
        },
        customerPhoneNumber: {
            type: String,
            required: true
        },
        customerAddPhoneNumber: {
            type: String
        },
        contactPerson: {
            type: String
        },
        personEmail: {
            type: String,
            required: true
        },
        personAddress: {
            type: String,
            required: true
        },
        personPhoneNumber: {
            type: String,
            required: true
        },
        personAddPhoneNumber: {
            type: String
        }
    }
);

const OrderSchema = new Schema(
    {
        customer: {
            type: String,
            required: true
        },
        customerType: {
            type: String,
            required: true
        },
        applicationsOpen: {
            type: Date,
            required: true
        },
        applicationsClose: {
            type: Date,
            required: true
        },
        minBudget: {
            type: Number
        },
        maxBudget: {
            type: Number
        },
        currency: {
            type: String,
            required: true
        },
        negotiable: {
            type: String
        },
        filingConditions: {
            type: String,
            required: true
        },
        specializations: {
            type: Schema.Types.ObjectId,
            ref: 'Specialization',
            required: true
        },
        project: GeneralInformationAboutTheProjectSchema,
        requirement: GeneralRequirementsToTheExecutorSchema,
        contact: ContactInformationSchema,
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        condition: {
            type: String,
            enum: Conditions,
            default: Conditions.PRIVATE,
            required: true
        },
        createdAt: {
            type: String
        },
        updatedAt: {
            type: String
        }
    }
);

const OrderModel = model<Order>('Order', OrderSchema);

export default OrderModel;