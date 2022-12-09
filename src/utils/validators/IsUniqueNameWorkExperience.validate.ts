import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { WorkExperiencesService } from '../../workExperiences/workExperiences.service';

@ValidatorConstraint({ async: true })
export class IsUniqueNameConstraint implements ValidatorConstraintInterface {
    validate(name: any, args: ValidationArguments) {
        return new WorkExperiencesService().findWorkExperienceByName(name).then(name => {
            if (name) return false;
            return true;
        });
    }

    defaultMessage(validationArguments?: ValidationArguments | undefined): string {
        return 'Work experience with name $value already exists';
    }
}

export function IsUniqueName(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueNameConstraint
        });
    };
}