import { Router, Request, Response, NextFunction } from 'express';
import { CompaniesService } from './companies.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateCompanyDto from './dto/createCompany.dto';
import UpdateCompanyDto from './dto/updateCompany.dto';
import UpdateContactsDto from './dto/updateContacts.dto';
import UpdateBPODto from './dto/updateBPO.dto';
import UpdateCompanyPortfolioDto from './dto/updateCompanyPortfolio.dto';
import UpdateCompanyTeamDto from './dto/updateCompanyTeam.dto';
import CompanyNotFoundException from '../exceptions/CompanyNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import PortfolioOfCompanyNotFoundException from '../exceptions/PortfolioOfCompanyNotFoundException';
import TeamOfTeamNotFoundException from '../exceptions/TeamOfCompanyNotFoundException';
import { isOwnerCompany, isOwnerCompanyPortfolio, isOwnerCompanyTeam } from '../middlewares/isOwnerCompany.middleware';
import { FilesService } from '../files/files.service';

export class CompaniesController {
  public path = '/company';
  public router = Router();
  private companiesService = new CompaniesService();
  private filesService = new FilesService();

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route(this.path).get(this.findAllCompanies);
    this.router.route(`/my${this.path}/list`).get(authMiddleware, this.getAllCompaniesOfUser);
    this.router
      .route(`/my${this.path}/new`)
      .post(
        authMiddleware,
        this.filesService.upload.single('logo'),
        dtoValidationMiddleware(CreateCompanyDto),
        this.createCompany
      );
    this.router.route(`${this.path}/:id`).get(this.findCompanyById);
    this.router
      .route(`/my${this.path}/:id/edit`)
      .put(
        authMiddleware,
        isOwnerCompany,
        this.filesService.upload.single('logo'),
        dtoValidationMiddleware(UpdateCompanyDto, true),
        this.updateCompany
      );
    this.router.route(`/my${this.path}/:id/delete`).delete(authMiddleware, isOwnerCompany, this.deleteCompany);
    this.router
      .route(`/my${this.path}/contacts/:id/edit`)
      .put(authMiddleware, isOwnerCompany, dtoValidationMiddleware(UpdateContactsDto, true), this.updateContacts);
    this.router
      .route(`/my${this.path}/bpo/:id/edit`)
      .put(authMiddleware, isOwnerCompany, dtoValidationMiddleware(UpdateBPODto, true), this.updateBPO);
    this.router.route(`/my${this.path}/:id/portfolio/new`).put(
      authMiddleware,
      this.filesService.upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 }
      ]),
      dtoValidationMiddleware(UpdateCompanyPortfolioDto, true),
      this.updateCompanyCreatePortfolio
    );
    this.router.route(`/my${this.path}/portfolio/:id/edit`).put(
      authMiddleware,
      this.filesService.upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 }
      ]),
      dtoValidationMiddleware(UpdateCompanyPortfolioDto, true),
      this.updateCompanyUpdatePortfolio
    );
    this.router
      .route(`/my${this.path}/portfolio/:id/delete`)
      .put(authMiddleware, isOwnerCompanyPortfolio, this.updateCompanyDeletePortfolio);
    this.router
      .route(`/my${this.path}/:id/team/new`)
      .put(authMiddleware, dtoValidationMiddleware(UpdateCompanyTeamDto, true), this.updateCompanyCreateTeam);
    this.router
      .route(`/my${this.path}/team/:id/edit`)
      .put(
        authMiddleware,
        isOwnerCompanyTeam,
        dtoValidationMiddleware(UpdateCompanyTeamDto, true),
        this.updateCompanyUpdateTeam
      );
    this.router
      .route(`/my${this.path}/team/:id/delete`)
      .put(authMiddleware, isOwnerCompanyTeam, this.updateCompanyDeleteTeam);
    this.router.route(`/my${this.path}/:id/publish`).put(authMiddleware, isOwnerCompany, this.publish);
    this.router.route(`/my${this.path}/:id/publish/cancel`).put(authMiddleware, isOwnerCompany, this.publishCancel);
  }

  private findCompanyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const company = await this.companiesService.findCompanyById(id);
      if (company) {
        return res.status(200).json(company);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private findAllCompanies = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const companies = await this.companiesService.findAllCompanies(query);
      return res.status(200).json(companies);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private createCompany = async (req: Request, res: Response) => {
    try {
      const companyData: CreateCompanyDto = req.body;
      const { file } = req;
      const newCompany = await this.companiesService.createCompany(
        companyData,
        (req as RequestWithUser).user,
        file?.path
      );
      return res.status(201).json(newCompany);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyData: UpdateCompanyDto = req.body;
      const { id } = req.params;
      const { file } = req;
      const updateCompany = await this.companiesService.updateCompany(id, companyData, file?.path);
      if (updateCompany) {
        return res.status(200).json(updateCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteCompany = await this.companiesService.deleteCompany(id);
      if (deleteCompany) {
        return res.status(200).json(deleteCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyContactsData: UpdateContactsDto = req.body;
      const { id } = req.params;
      const updateCompany = await this.companiesService.updateContacts(id, companyContactsData);
      if (updateCompany) {
        return res.status(200).json(updateCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateBPO = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyBPOData: UpdateBPODto = req.body;
      const { id } = req.params;
      const updateCompany = await this.companiesService.updateBPO(id, companyBPOData);
      if (updateCompany) {
        return res.status(200).json(updateCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateCompanyCreatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyPortfolioData: UpdateCompanyPortfolioDto = req.body;
      const { id } = req.params;
      const { files } = req;
      const updateCompany = await this.companiesService.updateCompanyCreatePortfolio(id, companyPortfolioData, files);
      if (updateCompany) {
        return res.status(201).json(updateCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateCompanyUpdatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyPortfolioData: UpdateCompanyPortfolioDto = req.body;
      const { id } = req.params;
      const { files } = req;
      const updateCompany = await this.companiesService.updateCompanyUpdatePortfolio(id, companyPortfolioData, files);
      if (updateCompany) {
        return res.status(200).json(updateCompany);
      }
      next(new PortfolioOfCompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateCompanyDeletePortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateCompany = await this.companiesService.updateCompanyDeletePortfolio(id);
      if (updateCompany) {
        return res.status(200).json(updateCompany);
      }
      next(new PortfolioOfCompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateCompanyCreateTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyTeamData: UpdateCompanyTeamDto = req.body;
      const { id } = req.params;
      const updateCompany = await this.companiesService.updateCompanyCreateTeam(id, companyTeamData);
      if (updateCompany) {
        return res.status(201).json(updateCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateCompanyUpdateTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyTeamData: UpdateCompanyTeamDto = req.body;
      const { id } = req.params;
      const updateCompany = await this.companiesService.updateCompanyUpdateTeam(id, companyTeamData);
      if (updateCompany) {
        return res.status(200).json(updateCompany);
      }
      next(new TeamOfTeamNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private updateCompanyDeleteTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateCompany = await this.companiesService.updateCompanyDeleteTeam(id);
      if (updateCompany) {
        return res.status(200).json(updateCompany);
      }
      next(new TeamOfTeamNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private getAllCompaniesOfUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as RequestWithUser).user.id;
      const { query } = req;
      const companies = await this.companiesService.getAllCompaniesOfUser(userId, query);
      return res.status(200).json(companies);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishCompany = await this.companiesService.publish(id);
      if (publishCompany) {
        return res.status(200).json(publishCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };

  private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishCancelCompany = await this.companiesService.publishCancel(id);
      if (publishCancelCompany) {
        return res.status(200).json(publishCancelCompany);
      }
      next(new CompanyNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
