import { FieldsError } from "#seedwork/domain/validators/validator-fields-interface";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class EntityValidationError extends Error {
  constructor(public error: FieldsError) {
    super("Entity Validation Error");
    this.name = "EntityValidationError";
  }
}

export class AuditFieldsValidationError extends Error {
  constructor(public error: FieldsError) {
    super(`AuditFields are not valid`);
    this.name = "AuditFieldsValidationError";
  }
}
