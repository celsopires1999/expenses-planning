import {
  AuditFields,
  AuditFieldsProps,
} from "#seedwork/domain/value-objects/audit-fields.vo";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";

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

  updateAuditFields(updated_by: string): void {
    this.auditFields = new AuditFields({
      ...this.auditFields.value,
      updated_by: updated_by,
      updated_at: new Date(),
    });
  }

  toJSON(): Required<
    {
      id: string;
      created_by: string;
      created_at: Date;
      update_by: string;
      updated_at: Date;
    } & Props
  > {
    return {
      id: this.id,
      ...this.auditFields.value,
      ...this.props,
    } as Required<
      {
        id: string;
        created_by: string;
        created_at: Date;
        update_by: string;
        updated_at: Date;
      } & Props
    >;
  }
}

export default Entity;
