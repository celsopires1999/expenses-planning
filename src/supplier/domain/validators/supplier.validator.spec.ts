import { SupplierProps } from "../entities/supplier";
import SupplierValidatorFactory, {
  SupplierRules,
  SupplierValidator,
} from "./supplier.validator";

describe("SupplierValidator Tests", () => {
  let validator: SupplierValidator;
  beforeEach(() => (validator = SupplierValidatorFactory.create()));

  test("invalidation cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  describe("valid cases for fields", () => {
    const arrange: SupplierProps[] = [{ name: "some name" }];
    test.each(arrange)("%#) when props are %o", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new SupplierRules(item));
      expect(validator.errors).toBeNull;
    });
  });
});
