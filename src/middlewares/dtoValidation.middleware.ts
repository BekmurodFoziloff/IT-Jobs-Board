import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import { RequestHandler } from 'express';
import HttpException from '../exceptions/HttpException';

function dtoValidationMiddleware(type: any, skipMissingProperties = false): RequestHandler {
  return (req, res, next) => {
    const dtoObj = plainToClass(type, req.body);
    validate(dtoObj, { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => (Object as any).values(error.constraints)).join(', ');
        next(new HttpException(400, message));
      } else {
        sanitize(dtoObj);
        req.body = dtoObj;
        next();
      }
    });
  };
}

export default dtoValidationMiddleware;
