import { AuditFields, AuditFieldsProps } from "./value-objects/audit-fields.vo";
import { UniqueEntityId } from "./value-objects/unique-entity-id.vo";

export abstract class Entity<Props = any> {
  public readonly uniqueEntityId: UniqueEntityId;
  private _auditFields: AuditFields;

  constructor(
    public readonly props: Props,
    auditFieldsProps: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    this.uniqueEntityId = id || new UniqueEntityId();
    this.auditFields = new AuditFields(auditFieldsProps);
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  get auditFields(): AuditFields {
    return this._auditFields;
  }

  private set auditFields(value: AuditFields) {
    this._auditFields = value;
  }

  get created_by(): string {
    return this._auditFields.value.created_by;
  }

  get created_at(): Date {
    return this._auditFields.value.created_at;
  }

  get updated_by(): string {
    return this._auditFields.value.updated_by;
  }

  get updated_at(): Date {
    return this._auditFields.value.updated_at;
  }

  toJSON(): Required<{ id: string; auditFields: string } & Props> {
    return {
      id: this.id,
      auditFields: this.auditFields.toString(),
      ...this.props,
    } as Required<{ id: string; auditFields: string } & Props>;
  }
}

export default Entity;
