import { Schema } from 'mongoose';

export const ProfileSchema = new Schema({
  avatar: {
    type: String
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  },
  aboutMe: {
    type: String
  },
  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }
  ],
  specializationCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SpecializationCategory',
      required: true
    }
  ]
});

export default ProfileSchema;
