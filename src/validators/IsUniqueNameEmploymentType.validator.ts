import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { EmploymentTypesService } from '../employmentTypes/employmentTypes.service';

@ValidatorConstraint({ async: true })
export class IsUniqueNameConstraint implements ValidatorConstraintInterface {
  async validate(name: any) {
    return new EmploymentTypesService().findEmploymentTypeByName(name).then((name) => {
      if (name) return false;
      return true;
    });
  }

  defaultMessage(): string {
    return 'Employment type with name $value already exists';
  }
}

export function IsUniqueName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueNameConstraint
    });
  };
}
