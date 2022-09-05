import { BudgetProps } from "#budget/domain/entities/budget";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ClassValidatorFields } from "#seedwork/domain/validators/class-validator-fields";

export class BudgetRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class BudgetValidator extends ClassValidatorFields<BudgetRules> {
  validate(data: BudgetProps): boolean {
    return super.validate(new BudgetRules(data));
  }
}

export class BudgetValidatorFactory {
  static create(): BudgetValidator {
    return new BudgetValidator();
  }
}

export default BudgetValidatorFactory;
