import { AuditFieldsValidationError } from "#seedwork/domain/errors/validation.error";
import { ClassValidatorFields } from "#seedwork/domain/validators/class-validator-fields";
import { ValueObject } from "#seedwork/domain/value-objects/value-object";
import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export interface AuditFieldsProps {
  created_by: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}
export class AuditFields extends ValueObject<AuditFieldsProps> {
  constructor(props: AuditFieldsProps) {
    const _props: AuditFieldsProps = { ...props };

    _props.created_at = _props.created_at ?? new Date();
    _props.updated_at = _props.updated_at ?? _props.created_at;
    _props.updated_by = _props.updated_by ?? _props.created_by;

    super(_props);

    AuditFields.validate(this.value);
  }

  static validate(props: AuditFieldsProps) {
    const validator = AuditFieldsValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new AuditFieldsValidationError(validator.errors);
    }
  }
}

class AuditFieldsRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  created_by: string;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  updated_by: string;

  @IsDate()
  @IsNotEmpty()
  @IsNotOlderThan("created_at", {
    message: "updated_at cannot be older than created_at",
  })
  updated_at: Date;

  constructor(data: any) {
    Object.assign(this, data);
  }
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

class AuditFieldsValidator extends ClassValidatorFields<AuditFieldsRules> {
  validate(data: AuditFieldsProps): boolean {
    return super.validate(new AuditFieldsRules(data));
  }
}

class AuditFieldsValidatorFactory {
  static create(): AuditFieldsValidator {
    return new AuditFieldsValidator();
  }
}
