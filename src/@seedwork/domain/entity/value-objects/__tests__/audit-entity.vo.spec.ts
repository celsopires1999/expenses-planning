import { AuditEntity, AuditEntityProps } from "../audit-entity.vo";
import { InvalidAuditEntityError } from "./../../../errors/invalid-audit-entity.error";

describe("AuditEntity Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(AuditEntity.prototype as any, "validate");
  });
  describe("should throw an error when created_by is invalid", () => {
    const arrange = [
      { testCase: 1, created_by: null, message: `Created By is required` },
      { testCase: 2, created_by: undefined, message: `Created By is required` },
      { testCase: 3, created_by: "", message: `Created By is required` },
      {
        testCase: 4,
        created_by: 5 as any,
        message: `Created By must be a string`,
      },
      {
        testCase: 5,
        created_by: true as any,
        message: `Created By must be a string`,
      },
    ];
    test.each(arrange)("$testCase) when created_by is $created_by", (i) => {
      expect(() => new AuditEntity({ created_by: i.created_by })).toThrowError(
        new InvalidAuditEntityError(i.message)
      );
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("should throw an error when props are invalid", () => {
    type Arrange = {
      testCase: number;
      props: AuditEntityProps;
      message: string;
    };
    const created_at = new Date();
    const arrange: Arrange[] = [
      {
        testCase: 1,
        props: { created_by: "user", created_at: "fake" as any },
        message: `Created At is invalid`,
      },
      {
        testCase: 2,
        props: {
          created_by: "user",
          created_at,
          updated_by: true as any,
        },
        message: `Updated By must be a string`,
      },
      {
        testCase: 3,
        props: {
          created_by: "user",
          created_at,
          updated_by: "user",
          updated_at: true as any,
        },
        message: `Updated At is invalid`,
      },
      {
        testCase: 4,
        props: {
          created_by: "user",
          created_at,
          updated_by: "user",
          updated_at: new Date(created_at.getTime() - 100),
        },
        message: `Updated At is older than Created At`,
      },
    ];

    test.each(arrange)("$testCase) when props is $props", (i) => {
      expect(() => new AuditEntity(i.props)).toThrowError(
        new InvalidAuditEntityError(i.message)
      );
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("should create a valid vo with created_by only", () => {
    const vo = new AuditEntity({ created_by: "user" });
    expect(vo.value.created_by).toBe("user");
    expect(vo.value.updated_by).toBe(vo.value.created_by);
    expect(vo.value.created_at).toBeInstanceOf(Date);
    expect(vo.value.updated_at).toBe(vo.value.created_at);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create a valid vo with created_by and created_at", () => {
    const created_at = new Date();
    const vo = new AuditEntity({ created_by: "user", created_at });
    expect(vo.value.created_by).toBe("user");
    expect(vo.value.updated_by).toBe(vo.value.created_by);
    expect(vo.value.created_at).toBe(created_at);
    expect(vo.value.updated_at).toBe(created_at);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create a valid vo with created_by, created_at and updated_by", () => {
    const created_at = new Date();
    const updated_at = new Date(created_at.getTime() + 100);
    const vo = new AuditEntity({
      created_by: "user",
      created_at,
      updated_by: "new user",
      updated_at,
    });
    expect(vo.value.created_by).toBe("user");
    expect(vo.value.updated_by).toBe("new user");
    expect(vo.value.created_at).toBe(created_at);
    expect(vo.value.updated_at).toBe(updated_at);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
