import { FieldsError } from "@seedwork/domain/validators/validator-fields-interface";
import { IsDate, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { AuditFieldsValidationError } from "../../errors/validation.error";
import { ClassValidatorFields } from "../../validators/class-validator-fields";
import { ValueObject } from "./value-object";

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

    if (props.created_at > props.updated_at) {
      const errors: FieldsError = {
        ["updated_at"]: ["updated_at is older than created_at"],
      };
      throw new AuditFieldsValidationError(errors);
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
  updated_at: Date;

  constructor(data: any) {
    Object.assign(this, data);
  }
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
