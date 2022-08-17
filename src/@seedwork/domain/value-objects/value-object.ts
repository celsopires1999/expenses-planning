import { deepFreeze } from "#seedwork/domain/utils/object";

export abstract class ValueObject<Value = any> {
  private _value: Value;
  constructor(value: Value) {
    const _value = value;

    this._value = deepFreeze(_value);
  }

  get value() {
    return this._value;
  }

  toString = () => {
    if (typeof this._value !== "object" || this._value === null) {
      try {
        return this._value.toString();
      } catch (e) {
        return this._value + "";
      }
    }
    const valueStr = this._value.toString();
    return valueStr === "[object Object]"
      ? JSON.stringify(this._value)
      : valueStr;
  };
}
export default ValueObject;
