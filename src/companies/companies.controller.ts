import { Router, Request, Response, NextFunction } from 'express';
import { CompaniesService } from './companies.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import { CreateCompanyDto } from './dto/createCompany.dto';
import {
    UpdateContactsDto,
    UpdateCompanyDto,
    UpdateBPODto,
    UpdateCompanyPortfolioDto,
    UpdateCompanyTeamDto
} from './dto/updateCompany.dto';
import CompanyNotFoundException from '../exceptions/CompanyNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import PortfolioOfCompanyNotFoundException from '../exceptions/PortfolioOfCompanyNotFoundException';
import TeamOfTeamNotFoundException from '../exceptions/TeamOfCompanyNotFoundException';
import { isOwnerCompany, isOwnerPortfolio, isOwnerTeam } from '../middlewares/isOwnerCompany.middleware';
import { upload } from '../files/files.service';

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
            .post(authMiddleware, upload.single('logo'), dtoValidationMiddleware(CreateCompanyDto), this.createCompany);
        this.router.route(`${this.path}/:id`)
            .get(this.findCompanyById);
        this.router.route(`/my${this.path}/:id/edit`)
            .put(authMiddleware, isOwnerCompany, upload.single('logo'), dtoValidationMiddleware(UpdateCompanyDto, true), this.updateCompany);
        this.router.route(`/my${this.path}/:id/delete`)
            .delete(authMiddleware, isOwnerCompany, this.deleteCompany);
        this.router.route(`/my${this.path}/contacts/:id/edit`)
            .put(authMiddleware, isOwnerCompany, dtoValidationMiddleware(UpdateContactsDto, true), this.updateContacts);
        this.router.route(`/my${this.path}/bpo/:id/edit`)
            .put(authMiddleware, isOwnerCompany, dtoValidationMiddleware(UpdateBPODto, true), this.updateBPO);
        this.router.route(`/my${this.path}/:id/portfolio/new`)
            .put(
                authMiddleware,
                upload.fields(
                    [
                        { name: 'image', maxCount: 1 },
                        { name: 'image1', maxCount: 1 },
                        { name: 'image2', maxCount: 1 }
                    ]
                ),
                dtoValidationMiddleware(UpdateCompanyPortfolioDto, true),
                this.updateCompanyCreatePortfolio
            );
        this.router.route(`/my${this.path}/portfolio/:id/edit`)
            .put(
                authMiddleware,
                upload.fields(
                    [
                        { name: 'image', maxCount: 1 },
                        { name: 'image1', maxCount: 1 },
                        { name: 'image2', maxCount: 1 }
                    ]
                ),
                dtoValidationMiddleware(UpdateCompanyPortfolioDto, true),
                this.updateCompanyUpdatePortfolio
            );
        this.router.route(`/my${this.path}/portfolio/:id/delete`)
            .put(authMiddleware, isOwnerPortfolio, this.updateCompanyDeletePortfolio);
        this.router.route(`/my${this.path}/:id/team/new`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyTeamDto, true), this.updateCompanyCreateTeam);
        this.router.route(`/my${this.path}/team/:id/edit`)
            .put(authMiddleware, isOwnerTeam, dtoValidationMiddleware(UpdateCompanyTeamDto, true), this.updateCompanyUpdateTeam);
        this.router.route(`/my${this.path}/team/:id/delete`)
            .put(authMiddleware, isOwnerTeam, this.updateCompanyDeleteTeam);
        this.router.route(`/my${this.path}/:id/publish`)
            .put(authMiddleware, isOwnerCompany, this.publish);
        this.router.route(`/my${this.path}/:id/publish-cancel`)
            .put(authMiddleware, isOwnerCompany, this.publishCancel);
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
        const { file } = req;
        const newCompanyResult = await this.companiesService.createCompany(
            companyData,
            (req as RequestWithUser).user,
            file?.path
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
        const { file } = req;
        const updateCompanyResult = await this.companiesService.updateCompany(
            id,
            companyData,
            file?.path
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private updateContacts = async (req: Request, res: Response, next: NextFunction) => {
        const companyContactsData: UpdateContactsDto = req.body;
        const { id } = req.params;
        const updateCompanyResult = await this.companiesService.updateContacts(
            id,
            companyContactsData
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private updateBPO = async (req: Request, res: Response, next: NextFunction) => {
        const companyBPOData: UpdateBPODto = req.body;
        const { id } = req.params;
        const updateCompanyResult = await this.companiesService.updateBPO(
            id,
            companyBPOData
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private updateCompanyCreatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        const companyPortfolio: UpdateCompanyPortfolioDto = req.body;
        const { id } = req.params;
        const { files } = req;
        const updateCompanyResult = await this.companiesService.updateCompanyCreatePortfolio(
            id,
            companyPortfolio,
            files
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private updateCompanyUpdatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        const companyPortfolio: UpdateCompanyPortfolioDto = req.body;
        const { id } = req.params;
        const { files } = req;
        const updateCompanyResult = await this.companiesService.updateCompanyUpdatePortfolio(
            id,
            companyPortfolio,
            files
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new PortfolioOfCompanyNotFoundException(id));
    }

    private updateCompanyDeletePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updateCompanyResult = await this.companiesService.updateCompanyDeletePortfolio(id);
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new PortfolioOfCompanyNotFoundException(id));
    }

    private updateCompanyCreateTeam = async (req: Request, res: Response, next: NextFunction) => {
        const companyTeam: UpdateCompanyTeamDto = req.body;
        const { id } = req.params;
        const updateCompanyResult = await this.companiesService.updateCompanyCreateTeam(
            id,
            companyTeam
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private updateCompanyUpdateTeam = async (req: Request, res: Response, next: NextFunction) => {
        const companyTeam: UpdateCompanyTeamDto = req.body;
        const { id } = req.params;
        const updateCompanyResult = await this.companiesService.updateCompanyUpdateTeam(
            id,
            companyTeam
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new TeamOfTeamNotFoundException(id));
    }

    private updateCompanyDeleteTeam = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updateCompanyResult = await this.companiesService.updateCompanyDeleteTeam(
            id
        );
        if (updateCompanyResult) {
            return res.send(updateCompanyResult);
        }
        next(new TeamOfTeamNotFoundException(id));
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const publishCompanyResult = await this.companiesService.publish(id);
        if (publishCompanyResult) {
            return res.send(publishCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const publishCancelCompanyResult = await this.companiesService.publishCancel(id);
        if (publishCancelCompanyResult) {
            return res.send(publishCancelCompanyResult);
        }
        next(new CompanyNotFoundException(id));
    }

    private getAllCompaniesOfUser = async (req: Request, res: Response) => {
        const userId = (req as RequestWithUser).user.id;
        const companies = await this.companiesService.getAllCompaniesOfUser(userId);
        return res.send(companies);
    }
}