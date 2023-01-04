import CompanyModel from './company.model';
import { CreateCompanyDto } from './dto/createCompany.dto';
import {
    UpdateCompanyContactsDto,
    UpdateCompanyDto,
    UpdateBusinessProcessOutsourcingDto,
    UpdateCompanyTeamDto,
    UpdateCompanyGeneralInformationAboutTheProjectDto
} from './dto/updateCompany.dto';
import { Company } from './company.interface';
import moment from 'moment';
import { User } from '../users/user.interface';
import { Conditions } from '../utils/enums/condition.enum';
import CompanyFilterQuery from '../interfaces/companyFilterQuery.interface';

export class CompaniesService {
    private companyModel = CompanyModel;

    public async findCompanyById(id: string): Promise<Company | null> {
        return await this.companyModel.findById(id)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async findAllCompanies(queryObj: any): Promise<Company[] | null> {
        const query: CompanyFilterQuery = {};
        if (queryObj.specializations && queryObj.specializations.length > 0) {
            query['specializations'] = { $in: queryObj.specializations }
        }
        return await this.companyModel.find(query)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async createCompany(company: CreateCompanyDto, owner: User): Promise<Company> {
        const newCompany = await this.companyModel.create({
            ...company,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newCompany.save();
        return await newCompany
            .populate('owner', 'email firstName lastName id');
    }

    public async deleteCompany(id: string): Promise<Company | null> {
        return await this.companyModel.findByIdAndDelete(id)
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompany(id: string, company: UpdateCompanyDto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                ...company,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async findCompanyByName(name: string): Promise<Company | null> {
        return await this.companyModel.findOne({ name });
    }

    public async updateCompanyContacts(id: string, companyContacts: UpdateCompanyContactsDto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'contacts': {
                        '_id': id,
                        ...companyContacts
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompanyBusinessProcessOutsourcing(id: string, companyBusinessProcessOutsourcing: UpdateBusinessProcessOutsourcingDto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'businessProcessOutsourcing': {
                        '_id': id,
                        ...companyBusinessProcessOutsourcing
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompanyCreateGeneralInformationAboutTheProject(id: string, portfolio: UpdateCompanyGeneralInformationAboutTheProjectDto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'portfolios': portfolio
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async getCompanyByGeneralInformationAboutTheProject(id: string): Promise<Company | null> {
        return await this.companyModel.findOne({ 'portfolios': { $elemMatch: { '_id': id } } })
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompanyUpdateGeneralInformationAboutTheProject(id: string, portfolio: UpdateCompanyGeneralInformationAboutTheProjectDto): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
            { 'portfolios': { $elemMatch: { '_id': id } } },
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
                new: true
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompanyDeleteGeneralInformationAboutTheProject(id: string): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
            { 'portfolios': { $elemMatch: { '_id': id } } },
            {
                $pull: {
                    'portfolios': {
                        '_id': id
                    }
                }
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompanyCreateTeam(id: string, team: UpdateCompanyTeamDto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'teams': team
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async getCompanyByTeam(id: string): Promise<Company | null> {
        return await this.companyModel.findOne({ 'teams': { $elemMatch: { '_id': id } } })
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompanyUpdateTeam(id: string, team: UpdateCompanyTeamDto): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
            { 'teams': { $elemMatch: { '_id': id } } },
            {
                $set: {
                    'teams.$[element]': {
                        '_id': id,
                        ...team
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
                new: true
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async updateCompanyDeleteTeam(id: string): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
            { 'teams': { $elemMatch: { '_id': id } } },
            {
                $pull: {
                    'teams': {
                        '_id': id
                    }
                }
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async getAllCompaniesOfUser(userId: string): Promise<Company[] | null> {
        return await this.companyModel.find({ owner: userId })
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async findCompanyByIdForUpdate(id: string): Promise<Company | null> {
        return await this.companyModel.findById(id)
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async publish(id: string, condition = Conditions.PUBLIC): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }

    public async publishCancel(id: string, condition = Conditions.PRIVATE): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', '-owner')
            .populate('industries', '-owner')
            .populate('specializations', '-owner')
            .populate('region', '-owner')
            .populate('businessProcessOutsourcing.specializationsBPO', '-owner');
    }
}