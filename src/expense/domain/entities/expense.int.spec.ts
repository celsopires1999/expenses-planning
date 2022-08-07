import { ExpenseType } from "../validators/expense.validator";
import { Supplier } from "./../../../supplier/domain/entities/supplier";
import { Team } from "./../../../team/domain/entities/team";
import { Expense, ExpenseProps } from "./expense";

describe("Expense Integration Tests", () => {
  describe("validations with errors", () => {
    describe("name prop", () => {
      const arrange = [
        {
          name: null as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: undefined as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "",
          message: {
            name: ["name should not be empty"],
          },
        },
        {
          name: 5,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: true,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: false,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "a".repeat(256),
          message: {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        },
      ];
      test.each(arrange)(`when name prop is "$name"`, (i) => {
        expect(
          () => new Expense({ name: i.name } as any, { created_by: "user" })
        ).containsErrorMessages(i.message);
      });
    });
    describe("description prop", () => {
      const arrange = [
        {
          description: 5,
          message: {
            description: ["description must be a string"],
          },
        },
        {
          description: true,
          message: {
            description: ["description must be a string"],
          },
        },
      ];

      test.each(arrange)(`when description prop is "$description"`, (i) => {
        expect(
          () =>
            new Expense(
              {
                name: "some name",
                description: i.description,
              } as any,
              { created_by: "user" }
            )
        ).containsErrorMessages(i.message);
      });
    });
  });
  describe("successfull operations", () => {
    describe("should create an entity", () => {
      const arrange: ExpenseProps[] = [
        {
          name: "some name",
          description: "some description",
          year: 2022,
          amount: 2000.55,
          type: ExpenseType.CAPEX,
          team: new Team({ name: "super team" }, { created_by: "user" }),
        },
        {
          name: "some name",
          description: "some description",
          year: 2022,
          amount: 2000.55,
          type: ExpenseType.CAPEX,
          supplier: new Supplier(
            { name: "super supplier" },
            { created_by: "user" }
          ),
          team: new Team({ name: "super team" }, { created_by: "user" }),
        },
        {
          name: "some name",
          description: "some description",
          year: 2022,
          amount: 2000.55,
          type: ExpenseType.CAPEX,
          supplier: new Supplier(
            { name: "super supplier" },
            { created_by: "user" }
          ),
          purchaseRequest: "1234567890",
          team: new Team({ name: "super team" }, { created_by: "user" }),
        },
        {
          name: "some name",
          description: "some description",
          year: 2022,
          amount: 2000.55,
          type: ExpenseType.CAPEX,
          supplier: new Supplier(
            { name: "super supplier" },
            { created_by: "user" }
          ),
          purchaseRequest: "1234567890",
          purchaseOrder: "9876543210",
          team: new Team({ name: "super team" }, { created_by: "user" }),
        },
      ];

      test.each(arrange)(" Test Case #%# - create Expense", (props) => {
        const entity = new Expense(props, { created_by: "system" });
        expect(entity.props).toMatchObject(props);
        expect(entity.id).toBeDefined();
      });
    });
  });
});
