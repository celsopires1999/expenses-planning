import {
  AuditFields,
  AuditFieldsProps,
} from "#seedwork/domain/value-objects/audit-fields.vo";

describe("AuditFields Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(AuditFields, "validate");
  });
  describe("should throw an error when created_by is invalid", () => {
    const arrange = [
      {
        testCase: 1,
        created_by: null as any,
        message: {
          created_by: [
            "created_by should not be empty",
            "created_by must be a string",
            "created_by must be shorter than or equal to 255 characters",
          ],
          updated_by: [
            "updated_by should not be empty",
            "updated_by must be a string",
            "updated_by must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        testCase: 2,
        created_by: undefined as any,
        message: {
          created_by: [
            "created_by should not be empty",
            "created_by must be a string",
            "created_by must be shorter than or equal to 255 characters",
          ],
          updated_by: [
            "updated_by should not be empty",
            "updated_by must be a string",
            "updated_by must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        testCase: 3,
        created_by: "",
        message: {
          created_by: ["created_by should not be empty"],
          updated_by: ["updated_by should not be empty"],
        },
      },
      {
        testCase: 4,
        created_by: 5 as any,
        message: {
          created_by: [
            "created_by must be a string",
            "created_by must be shorter than or equal to 255 characters",
          ],
          updated_by: [
            "updated_by must be a string",
            "updated_by must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        testCase: 5,
        created_by: true as any,
        message: {
          created_by: [
            "created_by must be a string",
            "created_by must be shorter than or equal to 255 characters",
          ],
          updated_by: [
            "updated_by must be a string",
            "updated_by must be shorter than or equal to 255 characters",
          ],
        },
      },
    ];
    test.each(arrange)("$testCase) when created_by is $created_by", (i) => {
      expect(
        () => new AuditFields({ created_by: i.created_by })
      ).containsErrorMessages(i.message);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("should throw an error when props are invalid", () => {
    type Arrange = {
      testCase: number;
      props: AuditFieldsProps;
      message: {};
    };
    const created_at = new Date();
    const arrange: Arrange[] = [
      {
        testCase: 1,
        props: { created_by: "user", created_at: "fake" as any },
        message: {
          created_at: ["created_at must be a Date instance"],
          updated_at: [
            "updated_at cannot be older than created_at",
            "updated_at must be a Date instance",
          ],
        },
      },
      {
        testCase: 2,
        props: {
          created_by: "user",
          created_at,
          updated_by: true as any,
        },
        message: {
          updated_by: [
            "updated_by must be a string",
            "updated_by must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        testCase: 3,
        props: {
          created_by: "user",
          created_at,
          updated_by: "user",
          updated_at: true as any,
        },
        message: {
          updated_at: [
            "updated_at cannot be older than created_at",
            "updated_at must be a Date instance",
          ],
        },
      },
      {
        testCase: 4,
        props: {
          created_by: "user",
          created_at,
          updated_by: "user",
          updated_at: new Date(created_at.getTime() - 100),
        },
        message: {
          updated_at: ["updated_at cannot be older than created_at"],
        },
      },
    ];

    test.each(arrange)("$testCase) when props are $props", (i) => {
      expect(() => new AuditFields(i.props)).containsErrorMessages(i.message);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("should create a valid vo with created_by only", () => {
    const vo = new AuditFields({ created_by: "user" });
    expect(vo.value.created_by).toBe("user");
    expect(vo.value.updated_by).toBe(vo.value.created_by);
    expect(vo.value.created_at).toBeInstanceOf(Date);
    expect(vo.value.updated_at).toBe(vo.value.created_at);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create a valid vo with created_by and created_at", () => {
    const created_at = new Date();
    const vo = new AuditFields({ created_by: "user", created_at });
    expect(vo.value.created_by).toBe("user");
    expect(vo.value.updated_by).toBe(vo.value.created_by);
    expect(vo.value.created_at).toBe(created_at);
    expect(vo.value.updated_at).toBe(created_at);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create a valid vo with created_by, created_at and updated_by", () => {
    const created_at = new Date();
    const updated_at = new Date(created_at.getTime() + 100);
    const vo = new AuditFields({
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
