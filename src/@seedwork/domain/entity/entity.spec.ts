import Entity from "./entity";
import { validate as uuidValidate } from "uuid";
import UniqueEntityId from "./value-objects/unique-entity-id.vo";

describe("Entity Unit Tests", () => {
  interface StubEntityProps {
    prop1: string;
    prop2?: number;
  }
  class StubEntity extends Entity<StubEntityProps> {}

  it("should set props and id", () => {
    const arrange: StubEntityProps = { prop1: "some name", prop2: 11 };
    const entity = new StubEntity(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(uuidValidate(entity.id)).toBeTruthy();
    expect(entity.props).toStrictEqual(arrange);
  });

  it("should accept a valid uuid", () => {
    const arrange: StubEntityProps = { prop1: "some name" };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.id).toBe(uniqueEntityId.value);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.props).toStrictEqual(arrange);
  });

  it("should convert an entity to a JavaScript Object", () => {
    const arrange: StubEntityProps = { prop1: "some name" };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual({
      id: uniqueEntityId.value,
      ...arrange,
    });
  });
});
