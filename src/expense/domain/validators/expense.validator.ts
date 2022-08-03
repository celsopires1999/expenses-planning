import { ExpenseProps } from "./../entities/expense";
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { ClassValidatorFields } from "./../../../@seedwork/domain/validators/class-validator-fields";

export class ExpenseRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class ExpenseValidator extends ClassValidatorFields<ExpenseRules> {
  validate(data: ExpenseProps): boolean {
    return super.validate(new ExpenseRules(data));
  }
}

export class ExpenseValidatorFactory {
  static create(): ExpenseValidator {
    return new ExpenseValidator();
  }
}

export default ExpenseValidatorFactory;
