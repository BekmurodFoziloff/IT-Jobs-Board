import { Schema, model } from 'mongoose';
import { User } from './user.interface';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        createdAt: {
            type: String
        }
    },
    {
        toJSON: { virtuals: true }
    }
);

UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

const UserModel = model<User>('User', UserSchema);

export default UserModel;