import { AuditFieldsProps } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { InvalidExpenseError } from "../errors/expense.error";
import {
  ExpenseType,
  ExpenseValidatorFactory,
} from "../validators/expense.validator";
import { Entity } from "./../../../@seedwork/domain/entity/entity";
import { UniqueEntityId } from "./../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "./../../../@seedwork/domain/errors/validation.error";
import { Supplier } from "./../../../supplier/domain/entities/supplier";
import { Team } from "./../../../team/domain/entities/team";

export interface ExpenseProps {
  name: string;
  description: string;
  year: number;
  amount: number;
  type: ExpenseType;
  supplier?: Supplier;
  purchaseRequest?: string;
  purchaseOrder?: string;
  team: Team;
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
    this.year = this.props.year;
    this.amount = this.props.amount;
    this.type = this.props.type;
    this.supplier = this.props.supplier;
    this.purchaseRequest = this.props.purchaseRequest;
    this.purchaseOrder = this.props.purchaseOrder;
    this.team = this.props.team;
  }

  change(
    props: {
      name?: string;
      description?: string;
      year?: number;
      amount?: number;
      type?: ExpenseType;
      team?: Team;
    },
    updated_by: string
  ): void {
    const _props = { ...this.props };

    _props.name = props.name ?? this.name;
    _props.description = props.description ?? this.description;
    _props.year = props.year ?? this.year;
    _props.amount = props.amount ?? this.amount;
    _props.type = props.type ?? this.type;
    _props.team = props.team ?? this.team;

    Expense.validate(_props);

    this.name = _props.name;
    this.description = _props.description;
    this.year = _props.year;
    this.amount = _props.amount;
    this.type = _props.type;
    this.team = _props.team;

    super.updateAuditFields(updated_by);
  }

  addSupplier(supplier: Supplier, updated_by: string): void {
    if (!supplier) {
      throw new InvalidExpenseError(`Supplier must be provided`);
    }
    this.handleSupplier(supplier, updated_by);
  }

  updateSupplier(supplier: Supplier, updated_by: string): void {
    this.handleSupplier(supplier, updated_by);
  }

  private handleSupplier(supplier: Supplier, updated_by: string): void {
    const _props = { ...this.props };
    _props.supplier = supplier;
    Expense.validate(_props);
    this.supplier = _props.supplier;
    super.updateAuditFields(updated_by);
  }

  addPurchaseRequest(purchaseRequest: string, updated_by: string): void {
    if (!purchaseRequest) {
      throw new InvalidExpenseError(`Purchase Request must be provided`);
    }
    if (this.purchaseRequest) {
      throw new InvalidExpenseError(`Expense has Purchase Request already`);
    }
    this.handlePurchaseRequest(purchaseRequest, updated_by);
  }

  updatePurchaseRequest(purchaseRequest: string, updated_by: string): void {
    this.handlePurchaseRequest(purchaseRequest, updated_by);
  }

  private handlePurchaseRequest(
    purchaseRequest: string,
    updated_by: string
  ): void {
    const _props = { ...this.props };
    _props.purchaseRequest = purchaseRequest;
    Expense.validate(_props);
    this.purchaseRequest = _props.purchaseRequest;
    super.updateAuditFields(updated_by);
  }

  addPurchaseOrder(purchaseOrder: string, updated_by: string): void {
    if (!purchaseOrder) {
      throw new InvalidExpenseError(`Purchase Order must be provided`);
    }
    if (this.purchaseOrder) {
      throw new InvalidExpenseError(`Expense has Purchase Order already`);
    }
    this.handlePurchaseOrder(purchaseOrder, updated_by);
  }

  updatePurchaseOrder(purchaseOrder: string, updated_by: string): void {
    this.handlePurchaseOrder(purchaseOrder, updated_by);
  }

  private handlePurchaseOrder(purchaseOrder: string, updated_by: string) {
    const _props = { ...this.props };
    _props.purchaseOrder = purchaseOrder;
    Expense.validate(_props);
    this.purchaseOrder = _props.purchaseOrder;
    super.updateAuditFields(updated_by);
  }

  addPurchaseDocs(
    purchaseRequest: string,
    purchaseOrder: string,
    updated_by: string
  ): void {
    if (!purchaseRequest || !purchaseOrder) {
      throw new InvalidExpenseError(
        `Purchase Request and Purchase Order must be provided`
      );
    }
    if (this.purchaseRequest) {
      throw new InvalidExpenseError(`Expense has Purchase Request already`);
    }
    if (this.purchaseOrder) {
      throw new InvalidExpenseError(`Expense has Purchase Order already`);
    }
    const _props = { ...this.props };
    _props.purchaseRequest = purchaseRequest;
    _props.purchaseOrder = purchaseOrder;
    Expense.validate(_props);
    this.purchaseRequest = _props.purchaseRequest;
    this.purchaseOrder = _props.purchaseOrder;
    super.updateAuditFields(updated_by);
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

  get year(): number {
    return this.props.year;
  }

  private set year(value: number) {
    this.props.year = value;
  }

  get amount(): number {
    return this.props.amount;
  }

  private set amount(value: number) {
    this.props.amount = value;
  }

  get type(): ExpenseType {
    return this.props.type;
  }

  private set type(value: ExpenseType) {
    this.props.type = value;
  }

  get supplier(): Supplier {
    return this.props.supplier;
  }

  private set supplier(value: Supplier) {
    this.props.supplier = value ?? null;
  }

  get purchaseRequest(): string {
    return this.props.purchaseRequest;
  }

  private set purchaseRequest(value: string) {
    this.props.purchaseRequest = value ?? null;
  }

  get purchaseOrder(): string {
    return this.props.purchaseOrder;
  }

  private set purchaseOrder(value: string) {
    this.props.purchaseOrder = value ?? null;
  }

  get team(): Team {
    return this.props.team;
  }

  private set team(value: Team) {
    this.props.team = value;
  }

  static validate(props: ExpenseProps) {
    const validator = ExpenseValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
