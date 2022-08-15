import { validate as uuidValidate } from "uuid";
import { InvalidUuidError } from "../../../@seedwork/domain/errors/invalid-uuid.error";
import ValueObject from "../../../@seedwork/domain/entity/value-objects/value-object";

export class TeamId extends ValueObject<string> {
  constructor(id: string) {
    super(id);
    this.validate(this.value);
  }

  private validate(value: string) {
    if (!uuidValidate(value)) {
      throw new InvalidUuidError();
    }
  }
}

export default TeamId;
