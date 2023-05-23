import UserModel from './user.model';
import CreateUserDto from './dto/createUser.dto';
import { User } from './user.interface';
import moment from 'moment';
import UpdateProfileDto from './dto/updateProfile.dto';
import UpdateContactsDto from './dto/updateContacts.dto';
import UpdateUserEducationDto from './dto/updateUserEducation.dto';
import UpdateUserWorkExperienceDto from './dto/updateUserWorkExperience.dto';
import UpdateUserAchievementDto from './dto/updateUserAchievement.dto';
import UpdateUserPortfolioDto from './dto/updateUserPortfolio.dto';
import { PublishConditions } from '../utils/enums/publishCondition.enum';
import UserFilterQuery from '../interfaces/userFilterQuery.interface';
import CompanyModel from '../companies/company.model';
import JobModel from '../jobs/job.model';
import OrderModel from '../orders/order.model';
import JobApplicationModel from '../jobApplications/jobApplication.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class UsersService {
  private userModel = UserModel;
  private companyModel = CompanyModel;
  private jobModel = JobModel;
  private orderModel = OrderModel;
  private jobApplicationModel = JobApplicationModel;

  public async findUserById(id: string): Promise<User | null> {
    return await this.userModel
      .findById(id)
      .where('isPublished')
      .equals(PublishConditions.PUBLIC)
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async findAllUsers(queryObj: any): Promise<User[] | null> {
    const query: UserFilterQuery = {};
    let pageNumber = 1;
    const pageSize = Number(process.env.PAGE_SIZE);
    if (queryObj.page) {
      pageNumber = Number(queryObj.page);
    } else if (queryObj.search) {
      query['$or'] = [
        { 'profile?.position': { $regex: queryObj.search, $options: 'i' } },
        { 'profile?.aboutMe': { $regex: queryObj.search, $options: 'i' } }
      ];
    }
    if (queryObj['profile.specializationCategories'] && queryObj['profile.specializationCategories'].length > 0) {
      query['profile.specializationCategories'] = { $in: queryObj['profile.specializationCategories'] };
    } else if (queryObj['profile.region'] && queryObj['profile.region'].length > 0) {
      query['profile.region'] = { $in: queryObj['profile.region'] };
    } else if (query['profile.skills'] && queryObj.profile.skills.length > 0) {
      query['profile.skills'] = { $in: queryObj.profile.skills };
    }
    return await this.userModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .where('isPublished')
      .equals(PublishConditions.PUBLIC)
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async createUser(user: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create({
      ...user,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    return await newUser.save();
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel
      .findOne({ email })
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async getUserById(id: string): Promise<User | null> {
    return await this.userModel
      .findById(id)
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateProfile(id: string, userProfile: UpdateProfileDto, avatar: any): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            profile: {
              _id: id,
              ...userProfile,
              avatar
            },
            firstName: userProfile.firstName,
            lastName: userProfile.lastName
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async deleteUser(id: string): Promise<User | null> {
    await this.companyModel.deleteMany({ owner: id });
    await this.jobModel.deleteMany({ owner: id });
    await this.orderModel.deleteMany({ owner: id });
    await this.jobApplicationModel.deleteMany({ jobOwner: id });
    return await this.userModel
      .findByIdAndDelete(id)
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateContacts(id: string, userContacts: UpdateContactsDto): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            contacts: {
              _id: id,
              ...userContacts
            }
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserCreateWorkExperience(
    id: string,
    workExperience: UpdateUserWorkExperienceDto
  ): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            workExperiences: workExperience
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async getUserByWorkExperience(id: string): Promise<User | null> {
    return await this.userModel
      .findOne({ workExperiences: { $elemMatch: { id: id } } })
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserUpdateWorkExperience(
    id: string,
    workExperience: UpdateUserWorkExperienceDto
  ): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { workExperiences: { $elemMatch: { id: id } } },
        {
          $set: {
            'workExperiences.$[element]': {
              _id: id,
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
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserDeleteWorkExperience(id: string): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { workExperiences: { $elemMatch: { id: id } } },
        {
          $pull: {
            workExperiences: {
              _id: id
            }
          }
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserCreateEducation(id: string, education: UpdateUserEducationDto): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            educations: education
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async getUserByEducation(id: string): Promise<User | null> {
    return await this.userModel
      .findOne({ educations: { $elemMatch: { id: id } } })
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserUpdateEducation(id: string, education: UpdateUserEducationDto): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { educations: { $elemMatch: { id: id } } },
        {
          $set: {
            'educations.$[element]': {
              _id: id,
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
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserDeleteEducation(id: string): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { educations: { $elemMatch: { id: id } } },
        {
          $pull: {
            educations: {
              _id: id
            }
          }
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserCreateAchievement(id: string, achievement: UpdateUserAchievementDto): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            achievements: achievement
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async getUserByAchievement(id: string): Promise<User | null> {
    return await this.userModel
      .findOne({ achievements: { $elemMatch: { id: id } } })
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserUpdateAchievement(id: string, achievement: UpdateUserAchievementDto): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { achievements: { $elemMatch: { id: id } } },
        {
          $set: {
            'achievements.$[element]': {
              _id: id,
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
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserDeleteAchievement(id: string): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { achievements: { $elemMatch: { id: id } } },
        {
          $pull: {
            achievements: {
              _id: id
            }
          }
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserCreatePortfolio(
    id: string,
    portfolio: UpdateUserPortfolioDto,
    files: any
  ): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            portfolios: {
              ...portfolio,
              image: files.image[0].path,
              image1: files.image1[0].path,
              image2: files.image2[0].path
            }
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async getUserByPortfolio(id: string): Promise<User | null> {
    return await this.userModel
      .findOne({ portfolios: { $elemMatch: { id: id } } })
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserUpdatePortfolio(
    id: string,
    portfolio: UpdateUserPortfolioDto,
    files: any
  ): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { portfolios: { $elemMatch: { id: id } } },
        {
          $set: {
            'portfolios.$[element]': {
              _id: id,
              ...portfolio,
              image: files.image[0].path,
              image1: files.image1[0].path,
              image2: files.image2[0].path
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
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async updateUserDeletePortfolio(id: string): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate(
        { portfolios: { $elemMatch: { id: id } } },
        {
          $pull: {
            portfolios: {
              _id: id
            }
          }
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async publish(id: string, publishCondition = PublishConditions.PUBLIC): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isPublished: publishCondition
          }
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async publishCancel(id: string, publishCondition = PublishConditions.PRIVATE): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isPublished: publishCondition
          }
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async hashPassword(password: string, salt = 10) {
    return await bcrypt.hash(password, salt);
  }

  public async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  public async changePassword(id: string, newPassword: string): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            password: newPassword
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('profile.region', 'id name')
      .populate('profile.skills', 'id name')
      .populate('profile.specializationCategories', 'id name')
      .populate('workExperiences.employmentTypes', 'id name');
  }

  public async setCurrentRefreshToken(refreshtoken: string, userId: string, salt = 10) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshtoken, salt);
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          currentHashedRefreshToken: currentHashedRefreshToken
        }
      },
      { returnDocument: 'after' }
    );
  }

  public async refreshTokenMatches(refreshToken: string, currentHashedRefreshToken: string) {
    return await bcrypt.compare(refreshToken, currentHashedRefreshToken);
  }

  public async removeCurrentRefreshToken(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          currentHashedRefreshToken: null
        }
      },
      { returnDocument: 'after' }
    );
  }

  public async createConfirmationToken() {
    return crypto.randomBytes(48).toString('base64url');
  }

  public async getUserByEmailConfirmationToken(emailConfirmationToken: string) {
    return await this.userModel.findOne({
      emailConfirmationToken,
      emailConfirmationTokenExpire: { $gt: Date.now() }
    });
  }

  public async removeEmailConfirmationTokenAndExpire(id: string) {
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          emailConfirmationToken: null,
          emailConfirmationTokenExpire: null
        }
      },
      { returnDocument: 'after' }
    );
  }

  public async setEmailconfirmed(id: string) {
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isEmailConfirmed: true
        }
      },
      { returnDocument: 'after' }
    );
  }

  public async getUserByResetPasswordConfirmationToken(resetPasswordConfirmationToken: string) {
    return await this.userModel.findOne({
      resetPasswordConfirmationToken,
      resetPasswordConfirmationTokenExpire: { $gt: Date.now() }
    });
  }

  public async setResetPasswordConfirmationTokenAndExpire(id: string, token: string, tokenExpire: number) {
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          resetPasswordConfirmationToken: token,
          resetPasswordConfirmationTokenExpire: tokenExpire
        }
      },
      { returnDocument: 'after' }
    );
  }

  public async removeResetPasswordConfirmationTokenAndExpire(id: string) {
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          resetPasswordConfirmationToken: null,
          resetPasswordConfirmationTokenExpire: null
        }
      },
      { returnDocument: 'after' }
    );
  }
}
