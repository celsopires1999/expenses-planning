import { Entity } from "#seedwork/domain/entity/entity";
import { validate as uuidValidate } from "uuid";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import {
  AuditFields,
  AuditFieldsProps,
} from "#seedwork/domain/value-objects/audit-fields.vo";

describe("Entity Unit Tests", () => {
  interface StubEntityProps {
    prop1: string;
    prop2?: number;
  }
  class StubEntity extends Entity<StubEntityProps> {}

  it("should set props and id", () => {
    const arrange: StubEntityProps = { prop1: "some name", prop2: 11 };
    const entity = new StubEntity(arrange, { created_by: "user" });
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(uuidValidate(entity.id)).toBeTruthy();
    expect(entity.props).toStrictEqual(arrange);
  });

  it("should accept a valid uuid", () => {
    const arrange: StubEntityProps = { prop1: "some name" };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(
      arrange,
      { created_by: "user" },
      uniqueEntityId
    );
    expect(entity.id).toBe(uniqueEntityId.value);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.props).toStrictEqual(arrange);
  });

  test("getter and setter of auditFields prop", () => {
    const entity = new StubEntity(
      { prop1: "some name" },
      { created_by: "user" }
    );
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
    const entity = new StubEntity(
      { prop1: "some name" },
      { created_by: "system" }
    );
    expect(entity.created_by).toBe("system");
  });

  test("getter of created_at prop", () => {
    const entity = new StubEntity(
      { prop1: "some name" },
      { created_by: "user" }
    );
    expect(entity.created_at).toBeInstanceOf(Date);
  });

  test("getter of updated_by prop", () => {
    const entity = new StubEntity(
      { prop1: "some name" },
      { created_by: "user", updated_by: "system" }
    );
    expect(entity.updated_by).toBe("system");
  });

  test("getter of updated_at prop", () => {
    const entity = new StubEntity(
      { prop1: "some name" },
      { created_by: "user", updated_by: "system" }
    );
    expect(entity.updated_at).toBeInstanceOf(Date);
  });

  it("should convert an entity to a JavaScript Object", () => {
    const arrange: StubEntityProps = { prop1: "some name" };
    const uniqueEntityId = new UniqueEntityId();

    const auditFieldsProps: AuditFieldsProps = {
      created_by: "user",
      created_at: new Date(),
      updated_by: "other user",
      updated_at: new Date(),
    };

    const entity = new StubEntity(arrange, auditFieldsProps, uniqueEntityId);

    const auditFields = new AuditFields(auditFieldsProps);
    expect(entity.toJSON()).toStrictEqual({
      id: uniqueEntityId.value,
      ...auditFields.value,
      ...arrange,
    });
  });
});
