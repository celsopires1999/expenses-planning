import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { InvalidUuidError } from "./../../errors/invalid-uuid.error";
import ValueObject from "./../value-objects/value-object";

export class UniqueEntityId extends ValueObject<string> {
  constructor(id?: string) {
    super(id || uuidv4());
    this.validate(this.value);
  }

  private validate(value: string) {
    if (!uuidValidate(value)) {
      throw new InvalidUuidError();
    }
  }
}

export default UniqueEntityId;
