import { AuditFieldsProps } from "#seedwork/domain/value-objects/audit-fields.vo";
import { BudgetValidatorFactory } from "#budget/domain/validators/budget.validator";
import { Entity } from "#seedwork/domain/entity/entity";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";

export interface BudgetProps {
  name: string;
}

export class Budget extends Entity<BudgetProps> {
  constructor(
    public readonly props: BudgetProps,
    auditFields: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    Budget.validate(props);
    super(props, auditFields, id);
    this.name = this.props.name;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  static validate(props: BudgetProps) {
    const validator = BudgetValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
