import { BudgetId } from "#expense/domain/entities/budget-id.vo";
import { Expense, ExpenseProps } from "#expense/domain/entities/expense";
import { SupplierId } from "#expense/domain/entities/supplier-id.vo";
import { TeamId } from "#expense/domain/entities/team-id.vo";
import { InvalidExpenseError } from "#expense/domain/errors/expense.error";
import { ExpenseType } from "#expense/domain/validators/expense.validator";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";

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
          "amount must have max two decimal places",
          "amount must not be less than 0.01",
        ],
        type: ["type should not be empty", "type must be a valid enum value"],
        team_id: [
          "team_id must be an instance of TeamId",
          "team_id should not be empty",
          "team_id must be a non-empty object",
        ],
        budget_id: [
          "budget_id must be an instance of BudgetId",
          "budget_id should not be empty",
          "budget_id must be a non-empty object",
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
  describe("change method", () => {
    let props: ExpenseProps;
    let entity: Expense;
    beforeEach(() => {
      props = {
        name: "some name",
        description: "some description",
        year: 2022,
        amount: 2500.55,
        type: ExpenseType.CAPEX,
        supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        purchaseRequest: "1234567890",
        purchaseOrder: "0987654321",
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
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
            "amount must have max two decimal places",
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
        entity.change({ team_id: "fake" as any }, "new user");
        fail("The entity has not thrown an EntityValidationError");
      } catch (e) {
        const err = e as EntityValidationError;
        expect(err.error).toMatchObject({
          team_id: [
            "team_id must be an instance of TeamId",
            "team_id must be a non-empty object",
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
            team_id: "fake team" as any,
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
            "amount must have max two decimal places",
            "amount must not be less than 0.01",
          ],
          type: ["type must be a valid enum value"],
          team_id: [
            "team_id must be an instance of TeamId",
            "team_id must be a non-empty object",
          ],
        });
      }
    });
  });
  test("addSupplier method", () => {
    const props: ExpenseProps = {
      name: "some name",
      description: "some description",
      year: 2022,
      amount: 2500.55,
      type: ExpenseType.CAPEX,
      team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
    };
    const entity = new Expense(props, { created_by: "user" });

    const supplier_id = new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae");

    entity.addSupplier(supplier_id, "user1");

    expect(entity.supplier_id).toStrictEqual(supplier_id);
    expect(entity.updated_by).toBe("user1");

    expect(() => entity.addSupplier(null, "user2")).toThrowError(
      new InvalidExpenseError(`SupplierId must be provided`)
    );
  });

  test("updateSupplier method", () => {
    const props: ExpenseProps = {
      name: "some name",
      description: "some description",
      year: 2022,
      amount: 2500.55,
      type: ExpenseType.CAPEX,
      supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
    };
    const entity = new Expense(props, { created_by: "user" });
    expect(entity.supplier_id.value).toBe(
      "47f3b2ad-8844-492a-a1a1-75a8c838daae"
    );

    const supplier_id = new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae");

    entity.updateSupplier(supplier_id, "user1");

    expect(entity.supplier_id).toBe(supplier_id);
    expect(entity.updated_by).toBe("user1");

    entity.updateSupplier(undefined, "user2");

    expect(entity.supplier_id).toBeNull();
  });

  test("addPurchaseRequest method", () => {
    const props: ExpenseProps = {
      name: "some name",
      description: "some description",
      year: 2022,
      amount: 2500.55,
      type: ExpenseType.CAPEX,
      supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
    };
    const entity = new Expense(props, { created_by: "user" });
    entity.addPurchaseRequest("1234567890", "user1");

    expect(entity.purchaseRequest).toBe("1234567890");

    expect(() => entity.addPurchaseRequest("1234567890", "user2")).toThrowError(
      `Expense has Purchase Request already`
    );

    expect(() => entity.addPurchaseRequest(undefined, "user2")).toThrowError(
      `Purchase Request must be provided`
    );
  });

  test("updatePurchaseRequest method", () => {
    const props: ExpenseProps = {
      name: "some name",
      description: "some description",
      year: 2022,
      amount: 2500.55,
      type: ExpenseType.CAPEX,
      supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      purchaseRequest: "1234567890",
      team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
    };
    const entity = new Expense(props, { created_by: "user" });
    entity.updatePurchaseRequest("0987654321", "user1");

    expect(entity.purchaseRequest).toBe("0987654321");

    expect(() => entity.addPurchaseRequest(undefined, "user2")).toThrowError(
      `Purchase Request must be provided`
    );
  });

  test("addPurchaseOrder method", () => {
    const props: ExpenseProps = {
      name: "some name",
      description: "some description",
      year: 2022,
      amount: 2500.55,
      type: ExpenseType.CAPEX,
      supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
    };
    const entity = new Expense(props, { created_by: "user" });
    entity.addPurchaseOrder("1234567890", "user1");

    expect(entity.purchaseOrder).toBe("1234567890");

    expect(() => entity.addPurchaseOrder("1234567890", "user2")).toThrowError(
      `Expense has Purchase Order already`
    );

    expect(() => entity.addPurchaseOrder(undefined, "user2")).toThrowError(
      `Purchase Order must be provided`
    );
  });

  test("updatePurchaseOrder method", () => {
    const props: ExpenseProps = {
      name: "some name",
      description: "some description",
      year: 2022,
      amount: 2500.55,
      type: ExpenseType.CAPEX,
      supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      purchaseOrder: "1234567890",
      team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
    };
    const entity = new Expense(props, { created_by: "user" });
    entity.updatePurchaseOrder("0987654321", "user1");

    expect(entity.purchaseOrder).toBe("0987654321");

    expect(() => entity.addPurchaseOrder(undefined, "user2")).toThrowError(
      `Purchase Order must be provided`
    );
  });

  test("addPurchaseDocs method", () => {
    const props: ExpenseProps = {
      name: "some name",
      description: "some description",
      year: 2022,
      amount: 2500.55,
      type: ExpenseType.CAPEX,
      supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
    };
    const entity = new Expense(props, { created_by: "user" });
    entity.addPurchaseDocs("1234567890", "0987654321", "user1");

    expect(entity.purchaseRequest).toBe("1234567890");
    expect(entity.purchaseOrder).toBe("0987654321");

    expect(() =>
      entity.addPurchaseDocs(undefined, undefined, "user1")
    ).toThrowError(
      new InvalidExpenseError(
        `Purchase Request and Purchase Order must be provided`
      )
    );

    expect(() =>
      entity.addPurchaseDocs("1234567890", undefined, "user1")
    ).toThrowError(
      new InvalidExpenseError(
        `Purchase Request and Purchase Order must be provided`
      )
    );

    expect(() =>
      entity.addPurchaseDocs("1234567890", "0987654321", "user1")
    ).toThrowError(
      new InvalidExpenseError(`Expense has Purchase Request already`)
    );

    entity["purchaseRequest"] = null;

    expect(() =>
      entity.addPurchaseDocs("1234567890", "0987654321", "user1")
    ).toThrowError(
      new InvalidExpenseError(`Expense has Purchase Order already`)
    );
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
          team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
          budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
        },
        {
          name: "some name",
          description: "some description",
          year: 2022,
          amount: 2000.55,
          type: ExpenseType.CAPEX,
          supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
          team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
          budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
        },
        {
          name: "some name",
          description: "some description",
          year: 2022,
          amount: 2000.55,
          type: ExpenseType.CAPEX,
          supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
          purchaseRequest: "1234567890",
          team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
          budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
        },
        {
          name: "some name",
          description: "some description",
          year: 2022,
          amount: 2000.55,
          type: ExpenseType.CAPEX,
          supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
          purchaseRequest: "1234567890",
          purchaseOrder: "9876543210",
          team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
          budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
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
        supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        purchaseRequest: "1234567890",
        purchaseOrder: "0987654321",
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
        budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
      };
      const entity = new Expense(props, { created_by: "user" });
      expect(entity.toJSON()).toMatchObject({
        name: "some name",
        description: "some description",
        year: 2022,
        amount: 2500.55,
        type: ExpenseType.CAPEX,
        supplier_id: "47f3b2ad-8844-492a-a1a1-75a8c838daae",
        purchaseRequest: "1234567890",
        purchaseOrder: "0987654321",
        team_id: "47f3b2ad-8844-492a-a1a1-75a8c838daae",
        budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
      });
      expect(entity.updated_at).toEqual(entity.created_at);

      const oldProps = { ...entity.props };

      const changeProps = {
        name: "new name",
        description: "new description",
        year: 2023,
        amount: 52.44,
        type: ExpenseType.OPEX,
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      };
      entity.change(changeProps, "new user");

      expect(entity.props).toMatchObject(changeProps);
      expect(entity.supplier_id.value).toBe(oldProps.supplier_id.value);
      expect(entity.purchaseRequest).toBe(oldProps.purchaseRequest);
      expect(entity.purchaseOrder).toBe(oldProps.purchaseOrder);
    });
  });
});
