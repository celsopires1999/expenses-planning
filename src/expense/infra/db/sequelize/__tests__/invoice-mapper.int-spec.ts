import { BudgetSequelize } from "#budget/infra/db/sequelize/budget-sequelize";
import { Invoice } from "#expense/domain/entities/invoice";
import { InvoiceStatus } from "#expense/domain/validators/invoice.validator";
import { InvoiceSequelize } from "#expense/infra/db/sequelize/invoice-sequelize";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { SupplierSequelize } from "#supplier/infra/db/sequelize/supplier-sequelize";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
import { ExpenseSequelize } from "../expense-sequelize";

const { InvoiceModel, InvoiceModelMapper } = InvoiceSequelize;
const { ExpenseModel } = ExpenseSequelize;
const { SupplierModel } = SupplierSequelize;
const { TeamModel, TeamRoleModel } = TeamSequelize;
const { BudgetModel } = BudgetSequelize;
const { TeamMemberModel } = TeamMemberSequelize;

describe("InvoiceMapper Integration Test", () => {
  setupSequelize({
    models: [
      InvoiceModel,
      ExpenseModel,
      SupplierModel,
      TeamModel,
      BudgetModel,
      TeamRoleModel,
      TeamMemberModel,
    ],
  });

  it("should throw error when entity is invalid", () => {
    const model = InvoiceModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      InvoiceModelMapper.toEntity(model);
      fail("The entity has not thrown a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        amount: [
          "amount should not be empty",
          "amount must have max two decimal places",
          "amount must not be less than 0.01",
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const model = InvoiceModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(Invoice, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => InvoiceModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a model into an entity", () => {
    const created_at = new Date();
    const date = new Date();
    const model = InvoiceModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      amount: 55.55,
      date,
      document: "ABCDEFGHIJ",
      status: InvoiceStatus.ACTUAL,
      created_by: "system",
      created_at,
    });

    const entity = InvoiceModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new Invoice(
        {
          amount: 55.55,
          date,
          document: "ABCDEFGHIJ",
          status: InvoiceStatus.ACTUAL,
        },
        {
          created_by: "system",
          created_at,
          updated_by: "system",
          updated_at: created_at,
        },
        new UniqueEntityId("312cffad-1938-489e-a706-643dc9a3cfd3")
      ).toJSON()
    );
  });
});
