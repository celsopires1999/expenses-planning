import { AuditFieldsProps } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { ExpenseValidatorFactory } from "../validators/expense.validator";
import { Entity } from "./../../../@seedwork/domain/entity/entity";
import { UniqueEntityId } from "./../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "./../../../@seedwork/domain/errors/validation.error";

export interface ExpenseProps {
  name: string;
  description: string;
}

export class Expense extends Entity<ExpenseProps> {
  constructor(
    public readonly props: ExpenseProps,
    auditFields: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    Expense.validate(props);
    super(props, auditFields, id);
    this.name = this.props.name;
    this.description = this.props.description;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get description(): string {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value;
  }

  static validate(props: ExpenseProps) {
    const validator = ExpenseValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
