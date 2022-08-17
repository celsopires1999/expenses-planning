import { omit } from "lodash";
import { validate as uuidValidate } from "uuid";
import { AuditFields } from "../../../@seedwork/domain/value-objects/audit-fields.vo";
import { ExpenseType } from "../validators/expense.validator";
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { Expense, ExpenseProps } from "./expense";
import { InvalidExpenseError } from "../errors/expense.error";
import SupplierId from "./supplier-id.vo";
import TeamId from "./team-id.vo";

const testProps: ExpenseProps = {
  name: "initial name",
  description: "initial description",
  year: 2022,
  amount: 150000,
  type: ExpenseType.OPEX,
  supplier_id: new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
  purchaseRequest: "1234567890",
  purchaseOrder: "0987654321",
  team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
};

describe("Expense Unit Test", () => {
  beforeEach(() => {
    Expense.validate = jest.fn();
  });
  test("constructor of entity with all props", () => {
    let props: ExpenseProps = {
      ...testProps,
    };

    const auditProps = {
      created_by: "user",
      created_at: new Date(),
      updated_by: "new user",
      updated_at: new Date(),
    };

    let entity = new Expense(props, auditProps);

    expect(Expense.validate).toHaveBeenCalledTimes(1);
    expect(entity.props).toStrictEqual(props);
    expect(entity.name).toBe(props.name);
    expect(entity.description).toBe(props.description);
    expect(entity.year).toBe(props.year);
    expect(entity.amount).toBe(props.amount);
    expect(entity.type).toBe(props.type);
    expect(entity.supplier_id).toStrictEqual(props.supplier_id);
    expect(entity.purchaseRequest).toBe(props.purchaseRequest);
    expect(entity.purchaseOrder).toBe(props.purchaseOrder);
    expect(entity.team_id).toStrictEqual(props.team_id);
    expect(entity.created_by).toBe(auditProps.created_by);
    expect(entity.created_at).toBe(auditProps.created_at);
    expect(entity.updated_by).toBe(auditProps.updated_by);
    expect(entity.updated_at).toBe(auditProps.updated_at);
  });

  test("constructor with mandatory props only", () => {
    const props = omit(testProps, [
      "supplier_id",
      "purchaseRequest",
      "purchaseOrder",
    ]);
    const entity = new Expense(props, { created_by: "user" });

    expect(entity.name).toBe(testProps.name);
    expect(entity.description).toBe(testProps.description);
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(entity.props).toStrictEqual(props);
    expect(entity.props).toMatchObject(props);
  });

  test("getter and setter of name prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.name).toBe(testProps.name);
    entity["name"] = "changed";
    expect(entity.name).toBe("changed");
  });

  test("getter and setter of description prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.description).toBe(testProps.description);
    entity["description"] = "changed";
    expect(entity.description).toBe("changed");
  });

  test("getter and setter of year prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.year).toBe(testProps.year);
    entity["year"] = 2023;
    expect(entity.year).toBe(2023);
  });

  test("getter and setter of amount prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.amount).toBe(testProps.amount);
    entity["amount"] = 160000.25;
    expect(entity.amount).toBe(160000.25);
  });

  test("getter and setter of type prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.type).toBe(testProps.type);
    entity["type"] = ExpenseType.CAPEX;
    expect(entity.type).toBe(ExpenseType.CAPEX);
  });

  test("getter and setter of supplier_id prop", () => {
    const supplier_id = new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae");
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.supplier_id).toBe(testProps.supplier_id);
    entity["supplier_id"] = supplier_id;
    expect(entity.supplier_id).toStrictEqual(supplier_id);
  });

  test("getter and setter of purchaseRequest prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.purchaseRequest).toBe(testProps.purchaseRequest);
    entity["purchaseRequest"] = "9876543210";
    expect(entity.purchaseRequest).toBe("9876543210");
  });

  test("getter and setter of purchaseOrder prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.purchaseOrder).toBe(testProps.purchaseOrder);
    entity["purchaseOrder"] = "0123456789";
    expect(entity.purchaseOrder).toBe("0123456789");
  });

  test("getter and setter of team_id prop", () => {
    const team_id = new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae");
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.team_id).toBe(testProps.team_id);
    entity["team_id"] = team_id;
    expect(entity.team_id).toStrictEqual(team_id);
  });

  test("getter and setter of auditFields prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.created_at).toBeInstanceOf(Date);
    const now = new Date();
    const auditFields = new AuditFields({
      created_by: "user",
      created_at: now,
    });
    entity["auditFields"] = auditFields;
    expect(entity.created_at).toStrictEqual(now);
  });

  test("getter of created_by prop", () => {
    const entity = new Expense(testProps, { created_by: "system" });
    expect(entity.created_by).toBe("system");
  });

  test("getter of created_at prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.created_at).toBeInstanceOf(Date);
  });

  test("getter of updated_by prop", () => {
    const entity = new Expense(testProps, {
      created_by: "user",
      updated_by: "system",
    });
    expect(entity.updated_by).toBe("system");
  });

  test("getter of updated_at prop", () => {
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.updated_at).toBeInstanceOf(Date);
  });

  describe("id prop", () => {
    const arrange = [
      { id: new UniqueEntityId("") },
      { id: new UniqueEntityId(undefined) },
      { id: new UniqueEntityId(null) },
      { id: new UniqueEntityId("8105290d-2b16-499d-aa61-5c252cf5c7d6") },
    ];

    test.each(arrange)("%#) when props are %j", (item) => {
      const entity = new Expense(testProps, { created_by: "user" }, item.id);
      expect(entity.id).not.toBeNull();
      expect(uuidValidate(entity.id)).toBeTruthy();
    });
  });

  describe("change method", () => {
    it("should change an entity", () => {
      const props: ExpenseProps = {
        name: "some name",
        description: "some description",
        year: 2022,
        amount: 2500.55,
        type: ExpenseType.CAPEX,
        team_id: new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae"),
      };
      const entity = new Expense(props, { created_by: "user1" });
      expect(entity.toJSON()).toMatchObject(props);
      expect(Expense.validate).toHaveBeenCalledTimes(1);
      expect(entity.updated_at).toEqual(entity.created_at);

      entity.change({ name: "new name" }, "user2");
      expect(Expense.validate).toHaveBeenCalledTimes(2);
      expect(entity.name).toBe("new name");
      expect(entity.updated_by).toBe("user2");
      expect(entity.updated_at.getTime()).toBeGreaterThanOrEqual(
        entity.created_at.getTime()
      );

      entity.change({ description: "new description" }, "user3");
      expect(Expense.validate).toHaveBeenCalledTimes(3);
      expect(entity.description).toBe("new description");
      expect(entity.updated_by).toBe("user3");

      entity.change({ year: 2023 }, "user4");
      expect(Expense.validate).toHaveBeenCalledTimes(4);
      expect(entity.year).toBe(2023);
      expect(entity.updated_by).toBe("user4");

      entity.change({ year: 2023 }, "user5");
      expect(Expense.validate).toHaveBeenCalledTimes(5);
      expect(entity.year).toBe(2023);
      expect(entity.updated_by).toBe("user5");

      entity.change({ amount: 600.66 }, "user6");
      expect(Expense.validate).toHaveBeenCalledTimes(6);
      expect(entity.amount).toBe(600.66);
      expect(entity.updated_by).toBe("user6");

      entity.change({ type: ExpenseType.OPEX }, "user7");
      expect(Expense.validate).toHaveBeenCalledTimes(7);
      expect(entity.type).toBe(ExpenseType.OPEX);
      expect(entity.updated_by).toBe("user7");

      const team_id = new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae");
      entity.change({ team_id: team_id }, "user8");
      expect(Expense.validate).toHaveBeenCalledTimes(8);
      expect(entity.team_id).toBe(team_id);
      expect(entity.updated_by).toBe("user8");
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
    };
    const entity = new Expense(props, { created_by: "user" });
    expect(Expense.validate).toHaveBeenCalledTimes(1);

    const supplier_id = new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae");

    entity.addSupplier(supplier_id, "user1");

    expect(Expense.validate).toHaveBeenCalledTimes(2);
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
    };
    const entity = new Expense(props, { created_by: "user" });
    expect(Expense.validate).toHaveBeenCalledTimes(1);
    expect(entity.supplier_id.value).toBe(
      "47f3b2ad-8844-492a-a1a1-75a8c838daae"
    );

    const supplier_id = new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae");

    entity.updateSupplier(supplier_id, "user1");

    expect(Expense.validate).toHaveBeenCalledTimes(2);
    expect(entity.supplier_id).toStrictEqual(supplier_id);
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
});
