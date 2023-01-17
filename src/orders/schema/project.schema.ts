import { Schema } from 'mongoose';

export const ProjectSchema = new Schema({
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
});

export default ProjectSchema;
