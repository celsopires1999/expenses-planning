import { InvoiceProps } from "#expense/domain/entities/invoice";
import { ClassValidatorFields } from "#seedwork/domain/validators/class-validator-fields";
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export enum InvoiceStatus {
  PLAN = "plan",
  ACTUAL = "actual",
}

const InvoiceStatusList: string[] = Object.values(InvoiceStatus);

export class InvoiceRules {
  @Min(0.01)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "amount must have max two decimal places" }
  )
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @MaxLength(10)
  @IsString()
  @IsOptional()
  document: string;

  @IsIn(InvoiceStatusList)
  @IsNotEmpty()
  status: InvoiceStatus;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class InvoiceValidator extends ClassValidatorFields<InvoiceRules> {
  validate(data: InvoiceProps): boolean {
    return super.validate(new InvoiceRules(data));
  }
}

export class InvoiceValidatorFactory {
  static create(): InvoiceValidator {
    return new InvoiceValidator();
  }
}

export default InvoiceValidatorFactory;
