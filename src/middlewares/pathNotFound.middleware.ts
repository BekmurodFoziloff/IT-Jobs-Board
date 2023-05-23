import { Request, Response, NextFunction } from 'express';
import PathNotFoundException from '../exceptions/PathNotFoundException';

export function pathNotFound(req: Request, res: Response, next: NextFunction) {
  return next(new PathNotFoundException(req.url));
}

export default pathNotFound;
