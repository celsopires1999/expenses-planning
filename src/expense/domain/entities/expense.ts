import { EntityValidationError } from "./../../../@seedwork/domain/errors/validation.error";
import ExpenseValidatorFactory from "../validators/expense.validator";
import Entity from "./../../../@seedwork/domain/entity/entity";
import UniqueEntityId from "./../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";

export interface ExpenseProps {
  name: string;
  description: string;
  created_at?: Date;
}

export class Expense extends Entity<ExpenseProps> {
  constructor(public readonly props: ExpenseProps, id?: UniqueEntityId) {
    Expense.validate(props);
    super(props, id);
    this.name = this.props.name;
    this.description = this.props.description;
    this.created_at = this.props.created_at;
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

  get created_at(): Date {
    return this.props.created_at;
  }

  private set created_at(value: Date) {
    this.props.created_at = value ?? new Date();
  }

  static validate(props: Omit<ExpenseProps, "created_at">) {
    const validator = ExpenseValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
