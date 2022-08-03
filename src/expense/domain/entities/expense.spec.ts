import { Expense, ExpenseProps } from "./expense";
import { omit } from "lodash";
import { validate as uuidValidate } from "uuid";
import UniqueEntityId from "./../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";

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
      created_at: new Date(),
    };

    let entity = new Expense(props);

    expect(Expense.validate).toHaveBeenCalled();
    expect(entity.props).toStrictEqual(props);
    expect(entity.name).toBeTruthy();
    expect(entity.description).toBe(props.description);
    expect(entity.created_at).toBe(props.created_at);
  });

  test("constructor with mandatory props only", () => {
    const entity = new Expense(expenseTestProps);

    expect(entity.name).toBe(expenseTestProps.name);
    expect(entity.description).toBe(expenseTestProps.description);
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(omit(entity.props, "created_at")).toStrictEqual({
      name: expenseTestProps.name,
      description: expenseTestProps.description,
    });
    expect(entity.props).toMatchObject({
      name: expenseTestProps.name,
      description: expenseTestProps.description,
    });
  });

  test("getter and setter of name prop", () => {
    const entity = new Expense(expenseTestProps);
    expect(entity.name).toBe(expenseTestProps.name);
    entity["name"] = "changed";
    expect(entity.name).toBe("changed");
  });

  test("getter and setter of description prop", () => {
    const entity = new Expense(expenseTestProps);
    expect(entity.description).toBe(expenseTestProps.description);
    entity["description"] = "changed";
    expect(entity.description).toBe("changed");
  });

  test("getter and setter of created_at prop", () => {
    const entity = new Expense(expenseTestProps);
    expect(entity.created_at).toBeInstanceOf(Date);
    const now = new Date();
    entity["created_at"] = now;
    expect(entity.created_at).toBe(now);
  });

  describe("id prop", () => {
    const arrange = [
      { id: new UniqueEntityId("") },
      { id: new UniqueEntityId(undefined) },
      { id: new UniqueEntityId(null) },
      { id: new UniqueEntityId("8105290d-2b16-499d-aa61-5c252cf5c7d6") },
    ];

    test.each(arrange)("%#) when props are %j", (item) => {
      const entity = new Expense(expenseTestProps, item.id);
      expect(entity.id).not.toBeNull();
      expect(uuidValidate(entity.id)).toBeTruthy();
    });
  });
});
