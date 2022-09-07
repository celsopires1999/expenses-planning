import {
  InvoiceStatus,
  InvoiceValidatorFactory,
} from "#expense/domain/validators/invoice.validator";
import { Entity } from "#seedwork/domain/entity/entity";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { AuditFieldsProps } from "#seedwork/domain/value-objects/audit-fields.vo";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";

export interface InvoiceProps {
  amount: number;
  date: Date;
  document?: string;
  status: InvoiceStatus;
}

export class Invoice extends Entity<InvoiceProps> {
  constructor(
    public readonly props: InvoiceProps,
    auditFields: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    Invoice.validate(props);
    super(props, auditFields, id);
    this.amount = this.props.amount;
    this.date = this.props.date;
    this.document = this.props.document;
    this.status = this.props.status;
  }

  get amount(): number {
    return this.props.amount;
  }

  private set amount(value: number) {
    this.props.amount = value;
  }

  get date(): Date {
    return this.props.date;
  }

  private set date(value: Date) {
    this.props.date = value;
  }

  get document(): string {
    return this.props.document;
  }

  private set document(value: string) {
    this.props.document = value ?? null;
  }

  get status(): InvoiceStatus {
    return this.props.status;
  }

  private set status(value: InvoiceStatus) {
    this.props.status = value;
  }

  static validate(props: InvoiceProps) {
    const validator = InvoiceValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
