import { InvalidAuditEntityError } from "./../../errors/invalid-audit-entity.error";
import ValueObject from "./value-object";

export interface AuditEntityProps {
  created_by: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}
export class AuditEntity extends ValueObject<AuditEntityProps> {
  constructor(props: AuditEntityProps) {
    if (!props.created_at) {
      props.created_at = new Date();
    }
    if (!props.updated_at) {
      props.updated_at = props.created_at;
    }
    if (!props.updated_by) {
      props.updated_by = props.created_by;
    }
    super(props);
    this.validate(this.value);
  }

  private validate(value: AuditEntityProps) {
    if (!value.created_by) {
      throw new InvalidAuditEntityError(`Created By is required`);
    }
    if (typeof value.created_by != "string") {
      throw new InvalidAuditEntityError(`Created By must be a string`);
    }
    if (!(value.created_at instanceof Date)) {
      throw new InvalidAuditEntityError(`Created At is invalid`);
    }
    if (typeof value.updated_by != "string") {
      throw new InvalidAuditEntityError(`Updated By must be a string`);
    }
    if (!(value.updated_at instanceof Date)) {
      throw new InvalidAuditEntityError(`Updated At is invalid`);
    }
    if (value.updated_at < value.created_at) {
      throw new InvalidAuditEntityError(`Updated At is older than Created At`);
    }
  }
}

export default AuditEntity;
