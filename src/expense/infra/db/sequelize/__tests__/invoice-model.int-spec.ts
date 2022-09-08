import { BudgetSequelize } from "#budget/infra/db/sequelize/budget-sequelize";
import { InvoiceStatus } from "#expense/domain/validators/invoice.validator";
import { InvoiceSequelize } from "#expense/infra/db/sequelize/invoice-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { SupplierSequelize } from "#supplier/infra/db/sequelize/supplier-sequelize";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
import { DataType } from "sequelize-typescript";
import { ExpenseSequelize } from "../expense-sequelize";

const { InvoiceModel } = InvoiceSequelize;
const { ExpenseModel } = ExpenseSequelize;
const { SupplierModel } = SupplierSequelize;
const { TeamModel, TeamRoleModel } = TeamSequelize;
const { BudgetModel } = BudgetSequelize;
const { TeamMemberModel } = TeamMemberSequelize;

describe("InvoiceModel Integration Tests", () => {
  setupSequelize({
    models: [
      InvoiceModel,
      ExpenseModel,
      SupplierModel,
      TeamModel,
      TeamRoleModel,
      BudgetModel,
      TeamMemberModel,
    ],
  });

  test("mapping attributes", () => {
    const attributesMap = InvoiceModel.getAttributes();
    const attributes = Object.keys(InvoiceModel.getAttributes());

    expect(attributes).toStrictEqual([
      "id",
      "expense_id",
      "amount",
      "date",
      "document",
      "status",
      "created_by",
      "created_at",
      "updated_by",
      "updated_at",
    ]);

    expect(attributesMap.id).toMatchObject({
      field: "id",
      fieldName: "id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    expect(attributesMap.expense_id).toMatchObject({
      field: "expense_id",
      fieldName: "expense_id",
      allowNull: false,
      type: DataType.UUID(),
    });

    expect(attributesMap.amount).toMatchObject({
      field: "amount",
      fieldName: "amount",
      allowNull: false,
      type: DataType.DECIMAL(10, 2),
    });

    expect(attributesMap.date).toMatchObject({
      field: "date",
      fieldName: "date",
      allowNull: false,
      type: DataType.DATE(),
    });

    expect(attributesMap.document).toMatchObject({
      field: "document",
      fieldName: "document",
      allowNull: true,
      type: DataType.STRING(10),
    });

    expect(attributesMap.status).toMatchObject({
      field: "status",
      fieldName: "status",
      allowNull: false,
      type: DataType.STRING(10),
    });

    expect(attributesMap.created_by).toMatchObject({
      field: "created_by",
      fieldName: "created_by",
      allowNull: false,
    });

    expect(attributesMap.created_at).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      allowNull: false,
      type: DataType.DATE(),
    });

    expect(attributesMap.updated_by).toMatchObject({
      field: "updated_by",
      fieldName: "updated_by",
      allowNull: false,
    });

    expect(attributesMap.updated_at).toMatchObject({
      field: "updated_at",
      fieldName: "updated_at",
      allowNull: false,
      type: DataType.DATE(),
    });
  });

  test("create", async () => {
    const arrange = {
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      expense_id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      amount: 55.55,
      date: new Date(),
      document: "FAT123",
      status: InvoiceStatus.ACTUAL,
      created_by: "system",
      created_at: new Date(),
      updated_by: "system",
      updated_at: new Date(),
    };

    try {
      await InvoiceModel.create(arrange);
      fail("The Model has not thrown an Error");
    } catch (e) {
      expect(e.name).toBe("SequelizeForeignKeyConstraintError");
    }
  });
});
