import Entity from "@seedwork/domain/entity/entity";
import { omit } from "lodash";
import { validate as uuidValidate } from "uuid";
import { AuditFields } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { ExpenseType } from "../validators/expense.validator";
import { UniqueEntityId } from "./../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { Supplier } from "./../../../supplier/domain/entities/supplier";
import { Team } from "./../../../team/domain/entities/team";
import { Expense, ExpenseProps } from "./expense";

const testProps: ExpenseProps = {
  name: "initial name",
  description: "initial description",
  year: 2022,
  amount: 150000,
  type: ExpenseType.OPEX,
  supplier: new Supplier({ name: "good supplier" }, { created_by: "user" }),
  purchaseRequest: "1234567890",
  purchaseOrder: "0987654321",
  team: new Team({ name: "the best team" }, { created_by: "user" }),
};

describe("Expense Unit Test", () => {
  beforeEach(() => {
    Expense.validate = jest.fn();
  });
  test("constructor of category with all props", () => {
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
    expect(entity.supplier).toStrictEqual(props.supplier);
    expect(entity.purchaseRequest).toBe(props.purchaseRequest);
    expect(entity.purchaseOrder).toBe(props.purchaseOrder);
    expect(entity.team).toStrictEqual(props.team);
    expect(entity.created_by).toBe(auditProps.created_by);
    expect(entity.created_at).toBe(auditProps.created_at);
    expect(entity.updated_by).toBe(auditProps.updated_by);
    expect(entity.updated_at).toBe(auditProps.updated_at);
  });

  test("constructor with mandatory props only", () => {
    const props = omit(testProps, [
      "supplier",
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

  test("getter and setter of supplier prop", () => {
    const supplier = new Supplier(
      { name: "better supplier" },
      { created_by: "system" }
    );
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.supplier).toBe(testProps.supplier);
    entity["supplier"] = supplier;
    expect(entity.supplier).toStrictEqual(supplier);
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

  test("getter and setter of team prop", () => {
    const team = new Team({ name: "better team" }, { created_by: "system" });
    const entity = new Expense(testProps, { created_by: "user" });
    expect(entity.team).toBe(testProps.team);
    entity["team"] = team;
    expect(entity.team).toStrictEqual(team);
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
        team: new Team({ name: "super team" }, { created_by: "user1" }),
      };
      const entity = new Expense(props, { created_by: "user1" });
      expect(entity.toJSON()).toMatchObject(props);
      expect(Expense.validate).toHaveBeenCalledTimes(1);
      expect(entity.updated_at).toEqual(entity.created_at);

      entity.change({ name: "new name" }, "user2");
      expect(Expense.validate).toHaveBeenCalledTimes(2);
      expect(entity.name).toBe("new name");
      expect(entity.updated_by).toBe("user2");
      expect(entity.updated_at).not.toEqual(entity.created_at);

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

      const team = new Team({ name: "new team" }, { created_by: "user" });
      entity.change({ team: team }, "user8");
      expect(Expense.validate).toHaveBeenCalledTimes(8);
      expect(entity.team).toBe(team);
      expect(entity.updated_by).toBe("user8");
    });
  });
});
