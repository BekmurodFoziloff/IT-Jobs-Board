import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEndDateGreatThanStartDate' })
export class IsEndDateGreatThanStartDateConstraint implements ValidatorConstraintInterface {
    validate(value: Date, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName]
        if (new Date(`${value}`).getTime() > new Date(`${relatedValue}`).getTime()) {
            return true;
        }
        return false;
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        const [relatedPropertyName] = validationArguments.constraints;
        const propertyName = validationArguments.property;
        return `${propertyName} must be great than ${relatedPropertyName} exactly`;
    }
}

export function IsEndDateGreatThanStartDate(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsEndDateGreatThanStartDateConstraint,
        });
    };
}