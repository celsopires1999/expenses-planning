import { ExpenseType } from "../validators/expense.validator";
import { EntityValidationError } from "./../../../@seedwork/domain/errors/validation.error";
import { Supplier } from "./../../../supplier/domain/entities/supplier";
import { Team } from "./../../../team/domain/entities/team";
import { Expense, ExpenseProps } from "./expense";

describe("Expense Integration Tests", () => {
  describe("validations with errors", () => {
    it("all required fields", () => {
      expect(
        () => new Expense({} as any, { created_by: "user" })
      ).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
        description: [
          "description should not be empty",
          "description must be a string",
        ],
        year: [
          "year should not be empty",
          "year must not be greater than 3000",
          "year must not be less than 2020",
          "year must be an integer number",
        ],
        amount: [
          "amount should not be empty",
          "amount must be a number conforming to the specified constraints",
          "amount must not be less than 0.01",
        ],
        type: ["type should not be empty", "type must be a valid enum value"],
        team: [
          "team must be an instance of Team",
          "team should not be empty",
          "team must be a non-empty object",
        ],
      });
    });
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
  describe("should throw error on update", () => {
    let props: ExpenseProps;
    let entity: Expense;
    beforeEach(() => {
      props = {
        name: "some name",
        description: "some description",
        year: 2022,
        amount: 2500.55,
        type: ExpenseType.CAPEX,
        supplier: new Supplier(
          { name: "good supplier" },
          { created_by: "super user" }
        ),
        purchaseRequest: "1234567890",
        purchaseOrder: "0987654321",
        team: new Team({ name: "super team" }, { created_by: "user" }),
      };
      entity = new Expense(props, { created_by: "user" });
    });
    test("name prop", () => {
      try {
        entity.change({ name: 5 as any }, "new user");
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });
      }
    });
    test("description prop", () => {
      try {
        entity.change({ description: 5 as any }, "new user");
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          description: ["description must be a string"],
        });
      }
    });
    test("year prop", () => {
      try {
        entity.change({ year: "2022" as any }, "new user");
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          year: [
            "year must not be greater than 3000",
            "year must not be less than 2020",
            "year must be an integer number",
          ],
        });
      }
    });
    test("amount prop", () => {
      try {
        entity.change({ amount: "50.55" as any }, "new user");
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          amount: [
            "amount must be a number conforming to the specified constraints",
            "amount must not be less than 0.01",
          ],
        });
      }
    });
    test("type prop", () => {
      try {
        entity.change({ type: "fake" as any }, "new user");
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          type: ["type must be a valid enum value"],
        });
      }
    });
    test("team prop", () => {
      try {
        entity.change({ team: "fake" as any }, "new user");
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          team: [
            "team must be an instance of Team",
            "team must be a non-empty object",
          ],
        });
      }
    });
    test("all props", () => {
      try {
        entity.change(
          {
            name: 5 as any,
            description: 55 as any,
            year: "fake year" as any,
            amount: "fake amount" as any,
            type: "fake type" as any,
            team: "fake team" as any,
          },
          "new user"
        );
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
          description: ["description must be a string"],
          year: [
            "year must not be greater than 3000",
            "year must not be less than 2020",
            "year must be an integer number",
          ],
          amount: [
            "amount must be a number conforming to the specified constraints",
            "amount must not be less than 0.01",
          ],
          type: ["type must be a valid enum value"],
          team: [
            "team must be an instance of Team",
            "team must be a non-empty object",
          ],
        });
      }
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
    it("should change an entity", () => {
      const props: ExpenseProps = {
        name: "some name",
        description: "some description",
        year: 2022,
        amount: 2500.55,
        type: ExpenseType.CAPEX,
        supplier: new Supplier(
          { name: "good supplier" },
          { created_by: "super user" }
        ),
        purchaseRequest: "1234567890",
        purchaseOrder: "0987654321",
        team: new Team({ name: "super team" }, { created_by: "user" }),
      };
      const entity = new Expense(props, { created_by: "user" });
      expect(entity.toJSON()).toMatchObject(props);
      expect(entity.updated_at).toEqual(entity.created_at);

      const oldProps = { ...entity.props };

      const changeProps = {
        name: "new name",
        description: "new description",
        year: 2023,
        amount: 52.44,
        type: ExpenseType.OPEX,
        team: new Team({ name: "gret team" }, { created_by: "super user" }),
      };
      entity.change(changeProps, "new user");

      expect(entity.props).toMatchObject(changeProps);
      expect(entity.supplier).toStrictEqual(oldProps.supplier);
      expect(entity.purchaseRequest).toBe(oldProps.purchaseRequest);
      expect(entity.purchaseOrder).toBe(oldProps.purchaseOrder);
    });
  });
});
