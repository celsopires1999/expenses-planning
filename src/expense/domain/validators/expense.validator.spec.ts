import { SupplierId } from "../entities/supplier-id.vo";
import { TeamId } from "../entities/team-id.vo";
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

  describe("invalidation cases for supplierId field", () => {
    const arrange = [
      {
        data: {
          supplier_id: {},
        },
        message: {
          supplier_id: [
            "supplier_id must be an instance of SupplierId",
            "supplier_id must be a non-empty object",
          ],
        },
      },
      {
        data: {
          supplier_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        },
        message: {
          supplier_id: ["supplier_id must be an instance of SupplierId"],
        },
      },

      {
        data: { supplier_id: 5 as any },
        message: {
          supplier_id: [
            "supplier_id must be an instance of SupplierId",
            "supplier_id must be a non-empty object",
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
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      },
      {
        name: "some name",
        description: "some description",
        year: 2021,
        amount: 100,
        type: ExpenseType.OPEX,
        supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      },
      {
        name: "some name",
        description: "some description",
        year: 2021,
        amount: 100,
        type: ExpenseType.OPEX,
        supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        purchaseRequest: "0123456789",
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      },
      {
        name: "some name",
        description: "some description",
        year: 2021,
        amount: 0.01,
        type: ExpenseType.OPEX,
        supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        purchaseRequest: "0123456789",
        purchaseOrder: "9876543210",
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      },
    ];
    test.each(arrange)("Test Case: #%#", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new ExpenseRules(item));
      expect(validator.errors).toBeNull;
    });
  });
  describe("invalidation cases for team_id field", () => {
    const arrange = [
      {
        data: {
          team_id: null as any,
        },
        message: {
          team_id: [
            "team_id must be an instance of TeamId",
            "team_id should not be empty",
            "team_id must be a non-empty object",
          ],
        },
      },
      {
        data: {
          team_id: {},
        },
        message: {
          team_id: [
            "team_id must be an instance of TeamId",
            "team_id must be a non-empty object",
          ],
        },
      },
      {
        data: {
          team_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        },
        message: {
          team_id: ["team_id must be an instance of TeamId"],
        },
      },
      {
        data: { team_id: 5 as any },
        message: {
          team_id: [
            "team_id must be an instance of TeamId",
            "team_id must be a non-empty object",
          ],
        },
      },
    ];

    test.each(arrange)("Test Case: #%# - team field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });
});
