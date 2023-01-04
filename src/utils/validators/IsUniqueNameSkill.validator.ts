import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { SkillsService } from '../../skills/skills.service';

@ValidatorConstraint({ async: true })
export class IsUniqueNameConstraint implements ValidatorConstraintInterface {
    validate(name: any, args: ValidationArguments) {
        return new SkillsService().findSkillByName(name).then(name => {
            if (name) return false;
            return true;
        });
    }

    defaultMessage(validationArguments?: ValidationArguments | undefined): string {
        return 'Skill with name $value already exists';
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