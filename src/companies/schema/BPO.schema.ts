import { Schema } from 'mongoose';

export const BPOSchema = new Schema({
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
});

export default BPOSchema;
