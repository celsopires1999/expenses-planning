import { InvoiceProps } from "#expense/domain/entities/invoice";
import InvoiceValidatorFactory, {
  InvoiceRules,
  InvoiceStatus,
  InvoiceValidator,
} from "#expense/domain/validators/invoice.validator";

describe("InvoiceValidator Tests", () => {
  let validator: InvoiceValidator;
  beforeEach(() => (validator = InvoiceValidatorFactory.create()));

  describe("invalidation for amount field", () => {
    const arrange = [
      {
        data: null,
        message: {
          amount: [
            "amount should not be empty",
            "amount must have max two decimal places",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: null },
        message: {
          amount: [
            "amount should not be empty",
            "amount must have max two decimal places",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: "" },
        message: {
          amount: [
            "amount should not be empty",
            "amount must have max two decimal places",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: -5 },
        message: {
          amount: ["amount must not be less than 0.01"],
        },
      },
      {
        data: { amount: 5.555 },
        message: {
          amount: ["amount must have max two decimal places"],
        },
      },
      {
        data: { amount: "t".repeat(256) },
        message: {
          amount: [
            "amount must have max two decimal places",
            "amount must not be less than 0.01",
          ],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - amount field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation for date field", () => {
    const arrange = [
      {
        data: null,
        message: {
          date: ["date should not be empty", "date must be a Date instance"],
        },
      },
      {
        data: { date: null },
        message: {
          date: ["date should not be empty", "date must be a Date instance"],
        },
      },
      {
        data: { date: "" },
        message: {
          date: ["date should not be empty", "date must be a Date instance"],
        },
      },
      {
        data: { date: -5 },
        message: {
          date: ["date must be a Date instance"],
        },
      },
      {
        data: { date: "t".repeat(256) },
        message: {
          date: ["date must be a Date instance"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - date field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation for document field", () => {
    const arrange = [
      {
        data: { document: 5 },
        message: {
          document: [
            "document must be a string",
            "document must be shorter than or equal to 10 characters",
          ],
        },
      },
      {
        data: { document: true },
        message: {
          document: [
            "document must be a string",
            "document must be shorter than or equal to 10 characters",
          ],
        },
      },
      {
        data: { document: "12345678901" },
        message: {
          document: ["document must be shorter than or equal to 10 characters"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - document field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation for status field", () => {
    const arrange = [
      {
        data: null,
        message: {
          status: [
            "status should not be empty",
            "status must be one of the following values: plan, actual",
          ],
        },
      },
      {
        data: { status: null },
        message: {
          status: [
            "status should not be empty",
            "status must be one of the following values: plan, actual",
          ],
        },
      },
      {
        data: { status: true },
        message: {
          status: ["status must be one of the following values: plan, actual"],
        },
      },
      {
        data: { status: "fake" },
        message: {
          status: ["status must be one of the following values: plan, actual"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - status field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("valid cases for fields", () => {
    const arrange: InvoiceProps[] = [
      {
        amount: 55.55,
        date: new Date(),
        document: "FAT123",
        status: InvoiceStatus.ACTUAL,
      },
      {
        amount: 55.55,
        date: new Date(),
        status: InvoiceStatus.PLAN,
      },
    ];
    test.each(arrange)("Test Case: #%#", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new InvoiceRules(item));
      expect(validator.errors).toBeNull();
    });
  });
});
