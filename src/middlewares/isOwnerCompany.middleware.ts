import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { CompaniesService } from '../companies/companies.service';
import YouAreNotAllowed from '../exceptions/YouAreNotAllowedException';

export const isOwnerCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companiesService = new CompaniesService();
        const { id } = req.params;
        const user = await companiesService.getCompanyById(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const isOwnerPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companiesService = new CompaniesService();
        const { id } = req.params;
        const user = await companiesService.getCompanyByPortfolio(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const isOwnerTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companiesService = new CompaniesService();
        const { id } = req.params;
        const user = await companiesService.getCompanyByTeam(id);
        if (!(user?.id.toString() === (req as RequestWithUser).user.id.toString())) {
            next(new YouAreNotAllowed());
        }
        next();
    } catch (error) {
        next(error);
    }
}