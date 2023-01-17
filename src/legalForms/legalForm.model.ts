import { model } from 'mongoose';
import { LegalForm } from './legalForm.interface';
import LegalFormSchema from './legalForm.schema';

const LegalFormModel = model<LegalForm>('LegalForm', LegalFormSchema);

export default LegalFormModel;
