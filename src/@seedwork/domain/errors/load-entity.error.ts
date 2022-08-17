import { FieldsError } from "#seedwork/domain/validators/validator-fields-interface";

export class LoadEntityError extends Error {
  constructor(public error: FieldsError, message?: string) {
    super(message ?? "An entity could not be loaded");
    this.name = "LoadEntityError";
  }
}
