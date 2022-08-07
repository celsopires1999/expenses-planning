import { Supplier } from "./../../../supplier/domain/entities/supplier";
import { Team } from "./../../../team/domain/entities/team";
import { ExpenseProps } from "./../entities/expense";
import ExpenseValidatorFactory, {
  ExpenseRules,
  ExpenseType,
  ExpenseValidator,
} from "./expense.validator";

describe("ExpenseValidator Tests", () => {
  let validator: ExpenseValidator;
  beforeEach(() => (validator = ExpenseValidatorFactory.create()));

  describe("invalidation for name field", () => {
    const arrange = [
      {
        data: null as any,
        message: {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        data: { name: null },
        message: {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        data: { name: "" },
        message: {
          name: ["name should not be empty"],
        },
      },
      {
        data: { name: 5 as any },
        message: {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        data: { name: "t".repeat(256) },
        message: {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - name field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation cases for description field", () => {
    const arrange = [
      {
        data: null as any,
        message: {
          description: [
            "description should not be empty",
            "description must be a string",
          ],
        },
      },
      {
        data: { description: null },
        message: {
          description: [
            "description should not be empty",
            "description must be a string",
          ],
        },
      },
      {
        data: { description: "" },
        message: {
          description: ["description should not be empty"],
        },
      },
      {
        data: { description: 5 as any },
        message: {
          description: ["description must be a string"],
        },
      },
      {
        data: { description: false as any },
        message: {
          description: ["description must be a string"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - description field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation cases for year field", () => {
    const arrange = [
      {
        data: null as any,
        message: {
          year: [
            "year should not be empty",
            "year must not be greater than 3000",
            "year must not be less than 2020",
            "year must be an integer number",
          ],
        },
      },
      {
        data: { year: null },
        message: {
          year: [
            "year should not be empty",
            "year must not be greater than 3000",
            "year must not be less than 2020",
            "year must be an integer number",
          ],
        },
      },
      {
        data: { year: "" },
        message: {
          year: [
            "year should not be empty",
            "year must not be greater than 3000",
            "year must not be less than 2020",
            "year must be an integer number",
          ],
        },
      },
      {
        data: { year: 2019 as any },
        message: {
          year: ["year must not be less than 2020"],
        },
      },
      {
        data: { year: 3001 as any },
        message: {
          year: ["year must not be greater than 3000"],
        },
      },
      {
        data: { year: false as any },
        message: {
          year: [
            "year must not be greater than 3000",
            "year must not be less than 2020",
            "year must be an integer number",
          ],
        },
      },
      {
        data: { year: 2022.5 },
        message: {
          year: ["year must be an integer number"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - year field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation cases for amount field", () => {
    const arrange = [
      {
        data: null as any,
        message: {
          amount: [
            "amount should not be empty",
            "amount must be a number conforming to the specified constraints",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: null },
        message: {
          amount: [
            "amount should not be empty",
            "amount must be a number conforming to the specified constraints",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: "" },
        message: {
          amount: [
            "amount should not be empty",
            "amount must be a number conforming to the specified constraints",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: {} },
        message: {
          amount: [
            "amount must be a number conforming to the specified constraints",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: "5" as any },
        message: {
          amount: [
            "amount must be a number conforming to the specified constraints",
            "amount must not be less than 0.01",
          ],
        },
      },
      {
        data: { amount: 0 as any },
        message: {
          amount: ["amount must not be less than 0.01"],
        },
      },
      {
        data: { amount: -1 as any },
        message: {
          amount: ["amount must not be less than 0.01"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - amount field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation cases for type field", () => {
    const arrange = [
      {
        data: null as any,
        message: {
          type: ["type should not be empty", "type must be a valid enum value"],
        },
      },
      {
        data: { type: null },
        message: {
          type: ["type should not be empty", "type must be a valid enum value"],
        },
      },
      {
        data: { type: "" },
        message: {
          type: ["type should not be empty", "type must be a valid enum value"],
        },
      },
      {
        data: { type: {} },
        message: {
          type: ["type must be a valid enum value"],
        },
      },
      {
        data: { type: "5" as any },
        message: {
          type: ["type must be a valid enum value"],
        },
      },
      {
        data: { type: 5 as any },
        message: {
          type: ["type must be a valid enum value"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - type field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation cases for supplier field", () => {
    const arrange = [
      {
        data: {
          supplier: {},
        },
        message: {
          supplier: [
            "supplier must be an instance of Supplier",
            "supplier must be a non-empty object",
          ],
        },
      },
      {
        data: {
          supplier: new Team({ name: "super team" }, { created_by: "user" }),
        },
        message: {
          supplier: ["supplier must be an instance of Supplier"],
        },
      },

      {
        data: { supplier: 5 as any },
        message: {
          supplier: [
            "supplier must be an instance of Supplier",
            "supplier must be a non-empty object",
          ],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - supplier field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation for purchaseRequest field", () => {
    const arrange = [
      {
        data: { purchaseRequest: "12345678901" as any },
        message: {
          purchaseRequest: ["purchaseRequest must be 10 characters"],
        },
      },
      {
        data: { purchaseRequest: "123456789" as any },
        message: {
          purchaseRequest: ["purchaseRequest must be 10 characters"],
        },
      },
      {
        data: { purchaseRequest: "123456789A" as any },
        message: {
          purchaseRequest: ["purchaseRequest must be a number string"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - purchaseRequest field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("invalidation for purchaseOrder field", () => {
    const arrange = [
      {
        data: { purchaseOrder: "12345678901" as any },
        message: {
          purchaseOrder: ["purchaseOrder must be 10 characters"],
        },
      },
      {
        data: { purchaseOrder: "123456789" as any },
        message: {
          purchaseOrder: ["purchaseOrder must be 10 characters"],
        },
      },
      {
        data: { purchaseOrder: "123456789A" as any },
        message: {
          purchaseOrder: ["purchaseOrder must be a number string"],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - purchaseRequest field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("valid cases for fields", () => {
    const arrange: ExpenseProps[] = [
      {
        name: "some name",
        description: "some description",
        year: 2021,
        amount: 100,
        type: ExpenseType.OPEX,
        team: new Team({ name: "the team" }, { created_by: "system" }),
      },
      {
        name: "some name",
        description: "some description",
        year: 2021,
        amount: 100,
        type: ExpenseType.OPEX,
        supplier: new Supplier(
          { name: "good supplier" },
          { created_by: "user" }
        ),
        team: new Team({ name: "the team" }, { created_by: "system" }),
      },
      {
        name: "some name",
        description: "some description",
        year: 2021,
        amount: 100,
        type: ExpenseType.OPEX,
        supplier: new Supplier(
          { name: "good supplier" },
          { created_by: "user" }
        ),
        purchaseRequest: "0123456789",
        team: new Team({ name: "the team" }, { created_by: "system" }),
      },
      {
        name: "some name",
        description: "some description",
        year: 2021,
        amount: 0.01,
        type: ExpenseType.OPEX,
        supplier: new Supplier(
          { name: "good supplier" },
          { created_by: "user" }
        ),
        purchaseRequest: "0123456789",
        purchaseOrder: "9876543210",
        team: new Team({ name: "the team" }, { created_by: "system" }),
      },
    ];
    test.each(arrange)("Test Case #%#", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new ExpenseRules(item));
      expect(validator.errors).toBeNull;
    });
  });
  describe("invalidation cases for team field", () => {
    const arrange = [
      {
        data: {
          team: null as any,
        },
        message: {
          team: [
            "team must be an instance of Team",
            "team should not be empty",
            "team must be a non-empty object",
          ],
        },
      },
      {
        data: {
          team: {},
        },
        message: {
          team: [
            "team must be an instance of Team",
            "team must be a non-empty object",
          ],
        },
      },
      {
        data: {
          team: new Supplier(
            { name: "super supplier" },
            { created_by: "user" }
          ),
        },
        message: {
          team: ["team must be an instance of Team"],
        },
      },

      {
        data: { team: 5 as any },
        message: {
          team: [
            "team must be an instance of Team",
            "team must be a non-empty object",
          ],
        },
      },
    ];

    test.each(arrange)("Test Case #%# - team field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });
});
