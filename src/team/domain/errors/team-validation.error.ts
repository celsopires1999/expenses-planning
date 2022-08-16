import { FieldsError } from "./../../../@seedwork/domain/validators/validator-fields-interface";

export class TeamValidationError extends Error {
  constructor(public error: FieldsError) {
    super(`Team is not valid`);
    this.name = "TeamValidationError";
  }
}
