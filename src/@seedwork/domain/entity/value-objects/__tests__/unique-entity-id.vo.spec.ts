import { InvalidUuidError } from "./../../../errors/invalid-uuid.error";
import { UniqueEntityId } from "./../../value-objects/unique-entity-id.vo";
import { validate as uuidValidate } from "uuid";

describe("UniqueEntityId Unit Tests", () => {
  it("should throw an error when Id is invalid", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");
    expect(() => new UniqueEntityId("fake")).toThrowError(
      new InvalidUuidError()
    );
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create an uuid when it is not passed in the constructor", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");
    expect(uuidValidate(new UniqueEntityId().value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept a valid uuid passed in the constructor", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");
    expect(
      uuidValidate(
        new UniqueEntityId("8105290d-2b16-499d-aa61-5c252cf5c7d6").value
      )
    ).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
