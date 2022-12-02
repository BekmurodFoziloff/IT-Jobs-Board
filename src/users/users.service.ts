import UserModel from './user.model';
import CreateUserDto from './dto/createUser.dto';
import { User } from './user.interface';
import moment from 'moment';

export class UsersService {
    private userModel = UserModel;

    public async createUser(user: CreateUserDto) {
        const newUser = await this.userModel.create({
            ...user,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        return newUser.save();
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email });
    }

    public async getUserById(id: string): Promise<User | null> {
        return await this.userModel.findById(id);
    }
}