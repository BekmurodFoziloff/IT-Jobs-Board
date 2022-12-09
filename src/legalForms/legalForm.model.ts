import { Schema, model } from 'mongoose';
import { LegalForm } from './legalForm.interface';

const LegalFormSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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

const LegalFormModel = model<LegalForm>('LegalForm', LegalFormSchema);

export default LegalFormModel;