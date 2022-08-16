import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { TeamRole } from "../team/domain/entities/team-role";
import { RoleName } from "../team/domain/validators/team-role.validator";

export function IsLongerThan(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isLongerThan",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === "string" &&
            typeof relatedValue === "string" &&
            value.length > relatedValue.length
          ); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}

export function IsNotOlderThan(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotOlderThan",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return (
            value instanceof Date &&
            relatedValue instanceof Date &&
            value >= relatedValue
          );
        },
      },
    });
  };
}

export function HasRoles(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "hasRoles",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: TeamRole[]) {
          if (!Array.isArray(value)) {
            return false;
          }
          const missingRoles = Object.values(RoleName).filter((item) =>
            value.map((role) => role.name).includes(item) ? false : true
          );

          return missingRoles.length === 0;
        },
      },
    });
  };
}
