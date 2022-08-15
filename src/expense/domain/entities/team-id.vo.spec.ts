import { InvalidUuidError } from "../../../@seedwork/domain/errors/invalid-uuid.error";
import TeamId from "./team-id.vo";

describe("TeamId Unit Tests", () => {
  it("should throw an error when Id is not valid", () => {
    expect(() => new TeamId("fake id")).toThrowError(
      new InvalidUuidError("Id must be a valid UUID")
    );
  });

  it("should create a valid Id", () => {
    const vo = new TeamId("47f3b2ad-8844-492a-a1a1-75a8c838daae");
    expect(vo.value).toBe("47f3b2ad-8844-492a-a1a1-75a8c838daae");
    expect(vo.toString()).toBe("47f3b2ad-8844-492a-a1a1-75a8c838daae");
  });
});
