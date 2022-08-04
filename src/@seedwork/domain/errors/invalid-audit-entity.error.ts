export class InvalidAuditEntityError extends Error {
  constructor(message?: string) {
    super(message || `Audit Entity is not valid`);
    this.name = "InvalidAuditEntityError";
  }
}
