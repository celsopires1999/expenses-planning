export class InvalidExpenseError extends Error {
  constructor(message?: string) {
    super(message || `Invalid params to update Expense`);
    this.name = "InvalidExpenseError";
  }
}
