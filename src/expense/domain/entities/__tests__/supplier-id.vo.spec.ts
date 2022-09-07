import { SupplierId } from "#expense/domain/entities/supplier-id.vo";
import { InvalidUuidError } from "#seedwork/domain/errors/invalid-uuid.error";

describe("SupplierId Unit Tests", () => {
  it("should throw an error when Id is not valid", () => {
    expect(() => new SupplierId("fake id")).toThrowError(
      new InvalidUuidError("Id must be a valid UUID")
    );
  });

  it("should create a valid Id", () => {
    const vo = new SupplierId("47f3b2ad-8844-492a-a1a1-75a8c838daae");
    expect(vo.value).toBe("47f3b2ad-8844-492a-a1a1-75a8c838daae");
    expect(vo.toString()).toBe("47f3b2ad-8844-492a-a1a1-75a8c838daae");
  });
});
