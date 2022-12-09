import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsUniqueNameConstraint implements ValidatorConstraintInterface {
    validate(toDate: Date, args: ValidationArguments) {
        if (new Date(`${toDate}`).toLocaleDateString() > new Date().toLocaleDateString()) {
            return true;
        }
        return false;
    }

    defaultMessage(validationArguments?: ValidationArguments | undefined): string {
        return 'toDate with date $value must be future';
    }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
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