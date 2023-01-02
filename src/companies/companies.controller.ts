import { Router, Request, Response, NextFunction } from 'express';
import { CompaniesService } from './companies.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyContactsDto, UpdateCompanyDto, UpdateBusinessProcessOutsourcingDto, UpdateCompanyGeneralInformationAboutTheProjectDto, UpdateCompanyTeamDto } from './dto/updateCompany.dto';
import CompanyNotFoundException from '../exceptions/CompanyNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import PortfolioOfCompanyNotFoundException from '../exceptions/PortfolioOfCompanyNotFoundException';
import TeamOfTeamNotFoundException from '../exceptions/TeamOfCompanyNotFoundException';

export class CompaniesController {
    public path = '/company';
    public router = Router();

    constructor(private companiesService: CompaniesService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllCompanies);
        this.router.route(`/my${this.path}/list`)
            .get(authMiddleware, this.getAllCompaniesOfUser);
        this.router.route(`/my${this.path}/new`)
            .post(authMiddleware, dtoValidationMiddleware(CreateCompanyDto), this.createCompany);
        this.router.route(`${this.path}/:id`)
            .get(this.findCompanyById);
        this.router.route(`/my${this.path}/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyDto, true), this.updateCompany);
        this.router.route(`/my${this.path}/:id/delete`)
            .delete(authMiddleware, this.deleteCompany);
        this.router.route(`/my${this.path}/contacts/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyContactsDto, true), this.updateCompanyContacts);
        this.router.route(`/my${this.path}/bpo/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateBusinessProcessOutsourcingDto, true), this.updateCompanyBusinessProcessOutsourcing);
        this.router.route(`/my${this.path}/:id/portfolio/new`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyGeneralInformationAboutTheProjectDto, true), this.updateCompanyCreateGeneralInformationAboutTheProject);
        this.router.route(`/my${this.path}/portfolio/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyGeneralInformationAboutTheProjectDto, true), this.updateCompanyUpdateGeneralInformationAboutTheProject);
        this.router.route(`/my${this.path}/portfolio/:id/delete`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyGeneralInformationAboutTheProjectDto, true), this.updateCompanyDeleteGeneralInformationAboutTheProject);
        this.router.route(`/my${this.path}/:id/team/new`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyTeamDto, true), this.updateCompanyCreateTeam);
        this.router.route(`/my${this.path}/team/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyTeamDto, true), this.updateCompanyUpdateTeam);
        this.router.route(`/my${this.path}/team/:id/delete`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyTeamDto, true), this.updateCompanyDeleteTeam);
        this.router.route(`/my${this.path}/:id/publish`)
            .put(this.publish);
        this.router.route(`/my${this.path}/:id/publish-cancel`)
            .put(this.publishCancel);
    }

    private findCompanyById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const company = await this.companiesService.findCompanyById(id);
        if (company) {
            return res.send(company);
        }
        next(new CompanyNotFoundException(id));
    }

    private findAllCompanies = async (req: Request, res: Response) => {
        const { query } = req;
        const companies = await this.companiesService.findAllCompanies(query);
        res.send(companies);
    }

    private createCompany = async (req: Request, res: Response) => {
        const companyData: CreateCompanyDto = req.body;
        const newCompanyResult = await this.companiesService.createCompany(
            companyData,
            (req as RequestWithUser).user
        );
        res.send(newCompanyResult);
    }

    private deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteCompanyResult = await this.companiesService.deleteCompany(id);
        if (deleteCompanyResult) {
            return res.send(deleteCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private updateCompany = async (req: Request, res: Response, next: NextFunction) => {
        const companyData: UpdateCompanyDto = req.body;
        const { id } = req.params;
        await this.companiesService.updateCompany(
            id,
            companyData
        );
        const updateCompanyResult = await this.companiesService.findCompanyById(id);
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private updateCompanyContacts = async (req: Request, res: Response) => {
        const companyContactsData: UpdateCompanyContactsDto = req.body;
        const { id } = req.params;
        await this.companiesService.updateCompanyContacts(
            id,
            companyContactsData
        );
        const updateCompanyContactsResult = await this.companiesService.findCompanyByIdForUpdate(id);
        if (updateCompanyContactsResult) {
            return res.send(updateCompanyContactsResult);
        }
    }

    private updateCompanyBusinessProcessOutsourcing = async (req: Request, res: Response) => {
        const companyBusinessProcessOutsourcingData: UpdateBusinessProcessOutsourcingDto = req.body;
        const { id } = req.params;
        await this.companiesService.updateCompanyBusinessProcessOutsourcing(
            id,
            companyBusinessProcessOutsourcingData
        );
        const updateCompanyBusinessProcessOutsourcingResult = await this.companiesService.findCompanyByIdForUpdate(id);
        if (updateCompanyBusinessProcessOutsourcingResult) {
            return res.send(updateCompanyBusinessProcessOutsourcingResult);
        }
    }

    private updateCompanyCreateGeneralInformationAboutTheProject = async (req: Request, res: Response, next: NextFunction) => {
        const companyGeneralInformationAboutTheProject: UpdateCompanyGeneralInformationAboutTheProjectDto = req.body;
        const { id } = req.params;
        await this.companiesService.updateCompanyCreateGeneralInformationAboutTheProject(
            id,
            companyGeneralInformationAboutTheProject
        );
        const companyNewGeneralInformationAboutTheProjectResult = await this.companiesService.findCompanyByIdForUpdate(id);
        if (companyNewGeneralInformationAboutTheProjectResult) {
            return res.send(companyNewGeneralInformationAboutTheProjectResult);
        }
        next(new NotAuthorizedException());
    }

    private updateCompanyUpdateGeneralInformationAboutTheProject = async (req: Request, res: Response, next: NextFunction) => {
        const companyGeneralInformationAboutTheProject: UpdateCompanyGeneralInformationAboutTheProjectDto = req.body;
        const { id } = req.params;
        await this.companiesService.updateCompanyUpdateGeneralInformationAboutTheProject(
            id,
            companyGeneralInformationAboutTheProject
        );
        const companyUpdateGeneralInformationAboutTheProjectResult = await this.companiesService.getCompanyByGeneralInformationAboutTheProject(id);
        if (companyUpdateGeneralInformationAboutTheProjectResult) {
            return res.send(companyUpdateGeneralInformationAboutTheProjectResult);
        }
        next(new PortfolioOfCompanyNotFoundException(id));
    }

    private updateCompanyDeleteGeneralInformationAboutTheProject = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.companiesService.updateCompanyDeleteGeneralInformationAboutTheProject(
            id
        );
        const companyUpdateGeneralInformationAboutTheProjectResult = await this.companiesService.getCompanyByGeneralInformationAboutTheProject(id);
        if (companyUpdateGeneralInformationAboutTheProjectResult) {
            return res.send(companyUpdateGeneralInformationAboutTheProjectResult);
        }
        next(new PortfolioOfCompanyNotFoundException(id));
    }

    private updateCompanyCreateTeam = async (req: Request, res: Response, next: NextFunction) => {
        const companyTeam: UpdateCompanyTeamDto = req.body;
        const { id } = req.params;
        await this.companiesService.updateCompanyCreateTeam(
            id,
            companyTeam
        );
        const companyNewTeamResult = await this.companiesService.getCompanyByTeam(id);
        if (companyNewTeamResult) {
            return res.send(companyNewTeamResult);
        }
        next(new NotAuthorizedException());
    }

    private updateCompanyUpdateTeam = async (req: Request, res: Response, next: NextFunction) => {
        const companyTeam: UpdateCompanyTeamDto = req.body;
        const { id } = req.params;
        await this.companiesService.updateCompanyUpdateTeam(
            id,
            companyTeam
        );
        const companyUpdateTeamResult = await this.companiesService.getCompanyByTeam(id);
        if (companyUpdateTeamResult) {
            return res.send(companyUpdateTeamResult);
        }
        next(new TeamOfTeamNotFoundException(id));
    }

    private updateCompanyDeleteTeam = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.companiesService.updateCompanyDeleteTeam(
            id
        );
        const companyUpdateTeamResult = await this.companiesService.getCompanyByTeam(id);
        if (companyUpdateTeamResult) {
            return res.send(companyUpdateTeamResult);
        }
        next(new TeamOfTeamNotFoundException(id));
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.companiesService.publish(id);
        const publishCompanyResult = await this.companiesService.findCompanyByIdForUpdate(id);
        if (publishCompanyResult) {
            return res.send(publishCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.companiesService.publishCancel(id);
        const publishCancelCompanyResult = await this.companiesService.findCompanyByIdForUpdate(id);
        if (publishCancelCompanyResult) {
            return res.send(publishCancelCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private getAllCompaniesOfUser = async (req: Request, res: Response) => {
        const userId = (req as RequestWithUser).user.id;
        const jobs = await this.companiesService.getAllCompaniesOfUser(userId);
        return res.send(jobs);
    }
}