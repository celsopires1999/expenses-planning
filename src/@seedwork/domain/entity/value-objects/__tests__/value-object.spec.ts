import { ValueObject } from "./../value-object";

describe("ValueObject Unit Tests", () => {
  it("should set a value", () => {
    interface Address {
      street: string;
      number: number;
      city: string;
      zip: string;
    }

    class StubValueObject extends ValueObject {}
    class StubValueObjectAddress extends ValueObject<Address> {}

    let vo = new StubValueObject("stub name");
    expect(vo.value).toBe("stub name");

    vo = new StubValueObject({ name: "stub name" });
    expect(vo.value).toStrictEqual({ name: "stub name" });

    vo = new StubValueObjectAddress({
      street: "New Street",
      number: 801,
      city: "São Paulo",
      zip: "03336-000",
    });

    expect(vo.value.street).toBe("New Street");
    expect(vo.value.number).toBe(801);
    expect(vo.value.city).toBe("São Paulo");
    expect(vo.value.zip).toBe("03336-000");
    expect(vo.value).toStrictEqual({
      street: "New Street",
      number: 801,
      city: "São Paulo",
      zip: "03336-000",
    });

    vo["_value"] = {
      street: "New Street",
      number: 802,
      city: "São Paulo",
      zip: "03336-000",
    };
    expect(vo.value.number).toBe(802);

    vo.value.street = "should not work";
    expect(vo.value.street).toBe("should not work");
  });

  it("should convert to string", () => {
    class StubValueObject extends ValueObject {}
    let vo = new StubValueObject("");
    expect(vo + "").toBe("");

    vo = new StubValueObject("name");
    expect(vo + "").toBe("name");

    vo = new StubValueObject(1);
    expect(vo + "").toBe("1");

    vo = new StubValueObject(1.11);
    expect(vo + "").toBe("1.11");

    vo = new StubValueObject(555);
    expect(vo + "").toBe("555");

    vo = new StubValueObject(null);
    expect(vo + "").toBe("null");

    vo = new StubValueObject(undefined);
    expect(vo + "").toBe("undefined");

    vo = new StubValueObject({ pro1: "new prop" });
    expect(vo + "").toBe(JSON.stringify({ pro1: "new prop" }));

    const date = new Date();
    vo = new StubValueObject(date);
    expect(vo + "").toBe(date.toString());
  });
});
