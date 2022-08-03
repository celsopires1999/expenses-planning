import { expect } from "expect";
import { FieldsError } from "../validators/validator-fields-interface";
import { EntityValidationError } from "./../errors/validation.error";
import { ClassValidatorFields } from "./../validators/class-validator-fields";

type Received =
  | { validator: ClassValidatorFields<any>; data: any }
  | (() => any);

expect.extend({
  containsErrorMessages(received: Received, expected: FieldsError) {
    if (typeof received === "function") {
      try {
        received();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorsMessages(expected, error.error);
      }
    } else {
      const { validator, data } = received;
      const validated = validator.validate(data);
      if (validated) {
        return isValid();
      }
      return assertContainsErrorsMessages(expected, validator.errors);
    }
  },
});

function isValid() {
  return {
    pass: false,
    message: () => "The data is valid",
  };
}

function assertContainsErrorsMessages(
  expected: FieldsError,
  received: FieldsError
) {
  const isMatch = expect.objectContaining(expected).asymmetricMatch(received);

  return isMatch
    ? { pass: true, message: () => "" }
    : {
        pass: false,
        message: () =>
          `The validation errors does not contain ${JSON.stringify(
            expected
          )}. Current: ${JSON.stringify(received)}`,
      };
}
