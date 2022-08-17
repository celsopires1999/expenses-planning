import { deepFreeze } from "#seedwork/domain/utils/object";

describe("Object Unit Tests", () => {
  it("should not freeze a scalar value", () => {
    let str = deepFreeze("fake string");
    expect(typeof str).toBe("string");
    str = deepFreeze("");
    expect(typeof str).toBe("string");

    let boolean = deepFreeze(true);
    expect(typeof boolean).toBe("boolean");
    boolean = deepFreeze(false);
    expect(typeof boolean).toBe("boolean");

    const num = deepFreeze(5);
    expect(typeof num).toBe("number");

    const testNull = deepFreeze(null);
    expect(testNull).toBeNull;

    const testUndefined = deepFreeze(undefined);
    expect(testUndefined).toBeUndefined;
  });
  it("should be an immutable object", () => {
    let obj = deepFreeze({
      prop1: "value1",
      deep: { prop2: "value2", prop3: new Date(), prop4: 4 },
    });
    expect(() => ((obj as any).prop1 = "not to work")).toThrowError(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );
    expect(() => ((obj as any).deep = "not to work")).toThrowError(
      "Cannot assign to read only property 'deep' of object '#<Object>'"
    );
    expect(() => ((obj as any).deep.prop2 = "not to work")).toThrowError(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );
    expect(() => ((obj as any).deep.prop3 = "not to work")).toThrowError(
      "Cannot assign to read only property 'prop3' of object '#<Object>'"
    );
    expect(() => ((obj as any).deep.prop4 = "not to work")).toThrowError(
      "Cannot assign to read only property 'prop4' of object '#<Object>'"
    );

    expect(obj.deep.prop3).toBeInstanceOf(Date);
  });
});
