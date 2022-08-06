import { Expense, ExpenseProps } from "./expense";
import { omit } from "lodash";
import { validate as uuidValidate } from "uuid";
import { UniqueEntityId } from "./../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { AuditFields } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";

const expenseTestProps = {
  name: "initial name",
  description: "initial description",
};

describe("Expense Unit Test", () => {
  beforeEach(() => {
    Expense.validate = jest.fn();
  });
  test("constructor of category with all props", () => {
    let props: ExpenseProps = {
      ...expenseTestProps,
    };

    const auditProps = {
      created_by: "user",
      created_at: new Date(),
      updated_by: "new user",
      updated_at: new Date(),
    };

    let entity = new Expense(props, auditProps);

    expect(Expense.validate).toHaveBeenCalled();
    expect(entity.props).toStrictEqual(props);
    expect(entity.name).toBeTruthy();
    expect(entity.description).toBe(props.description);
    expect(entity.created_by).toBe(auditProps.created_by);
    expect(entity.created_at).toBe(auditProps.created_at);
    expect(entity.updated_by).toBe(auditProps.updated_by);
    expect(entity.updated_at).toBe(auditProps.updated_at);
  });

  test("constructor with mandatory props only", () => {
    const entity = new Expense(expenseTestProps, { created_by: "user" });

    expect(entity.name).toBe(expenseTestProps.name);
    expect(entity.description).toBe(expenseTestProps.description);
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(omit(entity.props, "audit")).toStrictEqual({
      name: expenseTestProps.name,
      description: expenseTestProps.description,
    });
    expect(entity.props).toMatchObject({
      name: expenseTestProps.name,
      description: expenseTestProps.description,
    });
  });

  test("getter and setter of name prop", () => {
    const entity = new Expense(expenseTestProps, { created_by: "user" });
    expect(entity.name).toBe(expenseTestProps.name);
    entity["name"] = "changed";
    expect(entity.name).toBe("changed");
  });

  test("getter and setter of description prop", () => {
    const entity = new Expense(expenseTestProps, { created_by: "user" });
    expect(entity.description).toBe(expenseTestProps.description);
    entity["description"] = "changed";
    expect(entity.description).toBe("changed");
  });

  test("getter and setter of auditFields prop", () => {
    const entity = new Expense(expenseTestProps, { created_by: "user" });
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
    const entity = new Expense(expenseTestProps, { created_by: "system" });
    expect(entity.created_by).toBe("system");
  });

  test("getter of created_at prop", () => {
    const entity = new Expense(expenseTestProps, { created_by: "user" });
    expect(entity.created_at).toBeInstanceOf(Date);
  });

  test("getter of updated_by prop", () => {
    const entity = new Expense(expenseTestProps, {
      created_by: "user",
      updated_by: "system",
    });
    expect(entity.updated_by).toBe("system");
  });

  test("getter of updated_at prop", () => {
    const entity = new Expense(expenseTestProps, { created_by: "user" });
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
      const entity = new Expense(
        expenseTestProps,
        { created_by: "user" },
        item.id
      );
      expect(entity.id).not.toBeNull();
      expect(uuidValidate(entity.id)).toBeTruthy();
    });
  });
});
