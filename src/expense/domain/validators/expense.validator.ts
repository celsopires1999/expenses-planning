import {
  IsEnum,
  IsInstance,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { ClassValidatorFields } from "./../../../@seedwork/domain/validators/class-validator-fields";
import { ExpenseProps } from "./../entities/expense";
import { SupplierId } from "./../entities/supplier-id.vo";
import { TeamId } from "./../entities/team-id.vo";

export enum ExpenseType {
  CAPEX = "capex",
  OPEX = "opex",
}

export class ExpenseRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(2020)
  @Max(3000)
  @IsNotEmpty()
  year: number;

  @Min(0.01)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(ExpenseType)
  @IsNotEmpty()
  type: ExpenseType;

  @IsNotEmptyObject()
  @IsOptional()
  @IsInstance(SupplierId)
  supplier_id: SupplierId;

  @Length(10, 10, { message: "purchaseRequest must be 10 characters" })
  @IsNumberString()
  @IsOptional()
  purchaseRequest: string;

  @Length(10, 10, { message: "purchaseOrder must be 10 characters" })
  @IsNumberString()
  @IsOptional()
  purchaseOrder: string;

  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(TeamId)
  team_id: TeamId;

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
