import { Invoice, InvoiceProps } from "#expense/domain/entities/invoice";
import { InvoiceStatus } from "#expense/domain/validators/invoice.validator";
import { AuditFields } from "#seedwork/domain/value-objects/audit-fields.vo";

const testProps = {
  amount: 50.22,
  date: new Date(),
  document: "1234567890",
  status: InvoiceStatus.ACTUAL,
};

describe("Invoice Unit Test", () => {
  beforeEach(() => {
    Invoice.validate = jest.fn();
  });
  test("constructor of entity with all props", () => {
    let props: InvoiceProps = {
      ...testProps,
    };

    const auditProps = {
      created_by: "user",
      created_at: new Date(),
      updated_by: "new user",
      updated_at: new Date(),
    };

    let entity = new Invoice(props, auditProps);

    expect(Invoice.validate).toHaveBeenCalled();
    expect(entity.props).toStrictEqual(props);
    expect(entity.amount).toBe(testProps.amount);
    expect(entity.date).toBe(testProps.date);
    expect(entity.document).toBe(testProps.document);
    expect(entity.status).toBe(testProps.status);
    expect(entity.created_by).toBe(auditProps.created_by);
    expect(entity.created_at).toBe(auditProps.created_at);
    expect(entity.updated_by).toBe(auditProps.updated_by);
    expect(entity.updated_at).toBe(auditProps.updated_at);
  });

  test("constructor with mandatory props only", () => {
    const mandatoryProps = {
      amount: 20.55,
      date: new Date(),
      status: InvoiceStatus.PLAN,
    };
    const entity = new Invoice(mandatoryProps, { created_by: "user" });
    expect(entity.amount).toBe(mandatoryProps.amount);
    expect(entity.date).toBe(mandatoryProps.date);
    expect(entity.status).toBe(mandatoryProps.status);

    expect(entity.created_at).toBeInstanceOf(Date);
    expect(entity.props).toStrictEqual({
      amount: mandatoryProps.amount,
      date: mandatoryProps.date,
      document: null,
      status: mandatoryProps.status,
    });
  });

  test("getter and setter of amount prop", () => {
    const entity = new Invoice(testProps, { created_by: "user" });
    expect(entity.amount).toBe(testProps.amount);
    entity["amount"] = 33.33;
    expect(entity.amount).toBe(33.33);
  });

  test("getter and setter of date prop", () => {
    const date = new Date();
    const entity = new Invoice(testProps, { created_by: "user" });
    expect(entity.date).toBe(testProps.date);
    entity["date"] = date;
    expect(entity.date).toBe(date);
  });

  test("getter and setter of status prop", () => {
    const entity = new Invoice(testProps, { created_by: "user" });
    expect(entity.status).toBe(testProps.status);
    entity["status"] = InvoiceStatus.ACTUAL;
    expect(entity.status).toBe(InvoiceStatus.ACTUAL);
  });

  test("getter and setter of auditFields prop", () => {
    const entity = new Invoice(testProps, { created_by: "user" });
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
    const entity = new Invoice(testProps, { created_by: "system" });
    expect(entity.created_by).toBe("system");
  });

  test("getter of created_at prop", () => {
    const entity = new Invoice(testProps, { created_by: "user" });
    expect(entity.created_at).toBeInstanceOf(Date);
  });

  test("getter of updated_by prop", () => {
    const entity = new Invoice(testProps, {
      created_by: "user",
      updated_by: "system",
    });
    expect(entity.updated_by).toBe("system");
  });

  test("getter of updated_at prop", () => {
    const entity = new Invoice(testProps, { created_by: "user" });
    expect(entity.updated_at).toBeInstanceOf(Date);
  });

  // describe("id prop", () => {
  //   const arrange = [
  //     { id: new UniqueEntityId("") },
  //     { id: new UniqueEntityId(undefined) },
  //     { id: new UniqueEntityId(null) },
  //     { id: new UniqueEntityId("8105290d-2b16-499d-aa61-5c252cf5c7d6") },
  //   ];

  //   test.each(arrange)("%#) when props are %j", (item) => {
  //     const entity = new Supplier(testProps, { created_by: "user" }, item.id);
  //     expect(entity.id).not.toBeNull();
  //     expect(uuidValidate(entity.id)).toBeTruthy();
  //   });
  // });
});
