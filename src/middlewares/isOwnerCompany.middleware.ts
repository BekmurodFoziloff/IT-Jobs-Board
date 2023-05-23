import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { CompaniesService } from '../companies/companies.service';
import YouAreNotAllowedException from '../exceptions/YouAreNotAllowedException';

const companiesService = new CompaniesService();

export const isOwnerCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const company = await companiesService.getCompanyById(id);
    if (!(company?.owner.id.toString() === (req as RequestWithUser).user.id.toString())) {
      next(new YouAreNotAllowedException());
    }
    next();
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
};

export const isOwnerCompanyPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const company = await companiesService.getCompanyByPortfolio(id);
    if (!(company?.owner.id.toString() === (req as RequestWithUser).user.id.toString())) {
      next(new YouAreNotAllowedException());
    }
    next();
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
};

export const isOwnerCompanyTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const company = await companiesService.getCompanyByTeam(id);
    if (!(company?.owner.id.toString() === (req as RequestWithUser).user.id.toString())) {
      next(new YouAreNotAllowedException());
    }
    next();
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
};
