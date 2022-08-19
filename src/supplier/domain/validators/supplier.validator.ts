import { SupplierProps } from "#supplier/domain/entities/supplier";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ClassValidatorFields } from "#seedwork/domain/validators/class-validator-fields";

export class SupplierRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class SupplierValidator extends ClassValidatorFields<SupplierRules> {
  validate(data: SupplierProps): boolean {
    return super.validate(new SupplierRules(data));
  }
}

export class SupplierValidatorFactory {
  static create(): SupplierValidator {
    return new SupplierValidator();
  }
}

export default SupplierValidatorFactory;
