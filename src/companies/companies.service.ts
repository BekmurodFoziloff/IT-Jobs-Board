import CompanyModel from './company.model';
import { CreateCompanyDto } from './dto/createCompany.dto';
import {
    UpdateContactsDto,
    UpdateCompanyDto,
    UpdateBPODto,
    UpdateCompanyTeamDto,
    UpdateCompanyPortfolioDto
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
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async findAllCompanies(queryObj: any): Promise<Company[] | null> {
        const query: CompanyFilterQuery = {};
        if (queryObj.specializations && queryObj.specializations.length > 0) {
            query['specializations'] = { $in: queryObj.specializations }
        }
        return await this.companyModel.find(query)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async createCompany(company: CreateCompanyDto, owner: User, logo: any): Promise<Company> {
        const newCompany = await this.companyModel.create({
            ...company,
            owner,
            logo,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newCompany.save();
        return await newCompany
            .populate('owner', 'email firstName lastName id');
    }

    public async deleteCompany(id: string): Promise<Company | null> {
        return await this.companyModel.findByIdAndDelete(id)
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateCompany(id: string, company: UpdateCompanyDto, logo: any): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                ...company,
                logo,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async findCompanyByName(name: string): Promise<Company | null> {
        return await this.companyModel.findOne({ name });
    }

    public async updateContacts(id: string, contacts: UpdateContactsDto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'contacts': {
                        '_id': id,
                        ...contacts
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateBPO(id: string, bpo: UpdateBPODto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'bpo': {
                        '_id': id,
                        ...bpo
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateCompanyCreatePortfolio(id: string, portfolio: UpdateCompanyPortfolioDto, files: any): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'portfolios': {
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
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async getCompanyByPortfolio(id: string): Promise<Company | null> {
        return await this.companyModel.findOne({ 'portfolios': { $elemMatch: { 'id': id } } })
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateCompanyUpdatePortfolio(id: string, portfolio: UpdateCompanyPortfolioDto, files: any): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
            { 'portfolios': { $elemMatch: { 'id': id } } },
            {
                $set: {
                    'portfolios.$[element]': {
                        '_id': id,
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
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateCompanyDeletePortfolio(id: string): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
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
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateCompanyCreateTeam(id: string, team: UpdateCompanyTeamDto): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    'teams': team
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async getCompanyByTeam(id: string): Promise<Company | null> {
        return await this.companyModel.findOne({ 'teams': { $elemMatch: { 'id': id } } })
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateCompanyUpdateTeam(id: string, team: UpdateCompanyTeamDto): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
            { 'teams': { $elemMatch: { 'id': id } } },
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
                returnDocument: 'after'
            }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async updateCompanyDeleteTeam(id: string): Promise<Company | null> {
        return await this.companyModel.findOneAndUpdate(
            { 'teams': { $elemMatch: { 'id': id } } },
            {
                $pull: {
                    'teams': {
                        '_id': id
                    }
                }
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async getAllCompaniesOfUser(userId: string): Promise<Company[] | null> {
        return await this.companyModel.find({ owner: userId })
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async getCompanyById(id: string): Promise<Company | null> {
        return await this.companyModel.findById(id)
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async publish(id: string, condition = Conditions.PUBLIC): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }

    public async publishCancel(id: string, condition = Conditions.PRIVATE): Promise<Company | null> {
        return await this.companyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('legalForm', 'id name')
            .populate('industries', 'id name')
            .populate('specializations', 'id name')
            .populate('region', 'id name')
            .populate('bpo.specializationsBPO', 'id name');
    }
}