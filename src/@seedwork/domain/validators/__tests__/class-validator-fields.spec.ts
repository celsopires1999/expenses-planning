import * as libClassValidator from "class-validator";
import ClassValidatorFields from "#seedwork/domain/validators/class-validator-fields";
class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe("ClassVlidatorFields Unit Tests", () => {
  it("should initialize errors and validatedData", () => {
    const validator = new StubClassValidatorFields();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with errors", () => {
    const spyValidatedSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidatedSync.mockReturnValue([
      {
        property: "field",
        constraints: { isRequired: "some error" },
      },
    ]);
    const validator = new StubClassValidatorFields();
    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidatedSync).toHaveBeenCalled();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({ field: ["some error"] });
  });

  it("should validate without errors", () => {
    const spyValidatedSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidatedSync.mockReturnValue([]);
    const validator = new StubClassValidatorFields();
    expect(validator.validate({ field: "some value" })).toBeTruthy();
    expect(spyValidatedSync).toHaveBeenCalled();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toStrictEqual({ field: "some value" });
  });
});
