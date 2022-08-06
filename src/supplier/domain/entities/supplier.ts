import { AuditFieldsProps } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { SupplierValidatorFactory } from "../validators/supplier.validator";
import { Entity } from "../../../@seedwork/domain/entity/entity";
import { UniqueEntityId } from "../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { SupplierValidationError } from "../../../@seedwork/domain/errors/validation.error";

export interface SupplierProps {
  name: string;
}

export class Supplier extends Entity<SupplierProps> {
  constructor(
    public readonly props: SupplierProps,
    audit: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    Supplier.validate(props);
    super(props, audit, id);
    this.name = this.props.name;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  static validate(props: SupplierProps) {
    const validator = SupplierValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new SupplierValidationError(validator.errors);
    }
  }
}
