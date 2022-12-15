import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        const [relatedPropertyName] = validationArguments.constraints;
        const propertyName = validationArguments.property;
        return `${propertyName} must be match ${relatedPropertyName} exactly`;
    }
}

export function Match(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}