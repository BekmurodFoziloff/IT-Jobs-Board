import UserModel from './user.model';
import CreateUserDto from './dto/createUser.dto';
import { User } from './user.interface';
import moment from 'moment';
import {
    UpdateProfileDto,
    UpdateContactsDto,
    UpdateUserWorkExperienceDto,
    UpdateUserEducationDto,
    UpdateUserAchievementDto,
    UpdateUserPortfolioDto
} from './dto/updateUser.dto';
import { Conditions } from '../utils/enums/condition.enum';
import UserFilterQuery from '../interfaces/userFilterQuery.interface';

export class UsersService {
    private userModel = UserModel;

    public async findUserById(id: string): Promise<User | null> {
        return await this.userModel.findById(id)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async findAllUsers(queryObj: any): Promise<User[] | null> {
        const query: UserFilterQuery = {};
        if (queryObj['profile.specializationCategories'] && queryObj['profile.specializationCategories'].length > 0) {
            query['profile.specializationCategories'] = { $in: queryObj['profile.specializationCategories'] }
        } else if (queryObj['profile.region'] && queryObj['profile.region'].length > 0) {
            query['profile.region'] = { $in: queryObj['profile.region'] }
        } else if (query['profile.skills'] && queryObj.profile.skills.length > 0) {
            query['profile.skills'] = { $in: queryObj.profile.skills }
        }
        return await this.userModel.find(query)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async createUser(user: CreateUserDto): Promise<User> {
        const newUser = await this.userModel.create({
            ...user,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        return await newUser.save();
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email })
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async getUserById(id: string): Promise<User | null> {
        return await this.userModel.findById(id)
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async deleteUser(id: string): Promise<User | null> {
        return await this.userModel.findByIdAndDelete(id)
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateProfile(id: string, userProfile: UpdateProfileDto): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'profile': {
                        '_id': id,
                        ...userProfile
                    },
                    'firstName': userProfile.firstName,
                    'lastName': userProfile.lastName
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateContacts(id: string, userContacts: UpdateContactsDto): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'contacts': {
                        '_id': id,
                        ...userContacts
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserCreateWorkExperience(id: string, workExperience: UpdateUserWorkExperienceDto): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'workExperiences': workExperience
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async getUserByWorkExperience(id: string): Promise<User | null> {
        return await this.userModel.findOne({ 'workExperiences': { $elemMatch: { 'id': id } } })
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserUpdateWorkExperience(id: string, workExperience: UpdateUserWorkExperienceDto): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'workExperiences': { $elemMatch: { 'id': id } } },
            {
                $set: {
                    'workExperiences.$[element]': {
                        '_id': id,
                        ...workExperience
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            {
                arrayFilters: [
                    {
                        'element._id': id
                    }
                ],
                returnDocument: 'after'
            }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserDeleteWorkExperience(id: string): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'workExperiences': { $elemMatch: { 'id': id } } },
            {
                $pull: {
                    'workExperiences': {
                        '_id': id
                    }
                }
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserCreateEducation(id: string, education: UpdateUserEducationDto): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'educations': education
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async getUserByEducation(id: string): Promise<User | null> {
        return await this.userModel.findOne({ 'educations': { $elemMatch: { 'id': id } } })
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserUpdateEducation(id: string, education: UpdateUserEducationDto): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'educations': { $elemMatch: { 'id': id } } },
            {
                $set: {
                    'educations.$[element]': {
                        '_id': id,
                        ...education
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            {
                arrayFilters: [
                    {
                        'element._id': id
                    }
                ],
                returnDocument: 'after'
            }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserDeleteEducation(id: string): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'educations': { $elemMatch: { 'id': id } } },
            {
                $pull: {
                    'educations': {
                        '_id': id
                    }
                }
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserCreateAchievement(id: string, achievement: UpdateUserAchievementDto): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'achievements': achievement
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async getUserByAchievement(id: string): Promise<User | null> {
        return await this.userModel.findOne({ 'achievements': { $elemMatch: { 'id': id } } })
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserUpdateAchievement(id: string, achievement: UpdateUserAchievementDto): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'achievements': { $elemMatch: { 'id': id } } },
            {
                $set: {
                    'achievements.$[element]': {
                        '_id': id,
                        ...achievement
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            {
                arrayFilters: [
                    {
                        'element._id': id
                    }
                ],
                returnDocument: 'after'
            }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserDeleteAchievement(id: string): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'achievements': { $elemMatch: { 'id': id } } },
            {
                $pull: {
                    'achievements': {
                        '_id': id
                    }
                }
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserCreatePortfolio(id: string, portfolio: UpdateUserPortfolioDto): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'portfolios': portfolio
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async getUserByPortfolio(id: string): Promise<User | null> {
        return await this.userModel.findOne({ 'portfolios': { $elemMatch: { 'id': id } } })
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserUpdatePortfolio(id: string, portfolio: UpdateUserPortfolioDto): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'portfolios': { $elemMatch: { 'id': id } } },
            {
                $set: {
                    'portfolios.$[element]': {
                        '_id': id,
                        ...portfolio
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            {
                arrayFilters: [
                    {
                        'element._id': id
                    }
                ],
                returnDocument: 'after'
            }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async updateUserDeletePortfolio(id: string): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            { 'portfolios': { $elemMatch: { 'id': id } } },
            {
                $pull: {
                    'portfolios': {
                        '_id': id
                    }
                }
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async publish(id: string, condition = Conditions.PUBLIC): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }

    public async publishCancel(id: string, condition = Conditions.PRIVATE): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('profile.region', '-owner -createdAt -updatedAt')
            .populate('profile.skills', '-owner -createdAt -updatedAt')
            .populate('profile.specializationCategories', '-owner -createdAt -updatedAt')
            .populate('workExperiences.employmentTypes', '-owner -createdAt -updatedAt');
    }
}