import { BudgetSequelize } from "#budget/infra/db/sequelize/budget-sequelize";
import { ExpenseType } from "#expense/domain/validators/expense.validator";
import { ExpenseSequelize } from "#expense/infra/db/sequelize/expense-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { SupplierSequelize } from "#supplier/infra/db/sequelize/supplier-sequelize";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
import { DataType } from "sequelize-typescript";

const { ExpenseModel } = ExpenseSequelize;
const { SupplierModel } = SupplierSequelize;
const { TeamModel, TeamRoleModel } = TeamSequelize;
const { TeamMemberModel } = TeamMemberSequelize;
const { BudgetModel } = BudgetSequelize;

describe("ExpenseModel Integration Tests", () => {
  setupSequelize({
    models: [
      ExpenseModel,
      SupplierModel,
      TeamModel,
      TeamRoleModel,
      TeamMemberModel,
      BudgetModel,
    ],
  });

  test("mapping attributes", () => {
    const attributesMap = ExpenseModel.getAttributes();
    const attributes = Object.keys(ExpenseModel.getAttributes());

    expect(attributes).toStrictEqual([
      "id",
      "name",
      "description",
      "year",
      "amount",
      "type",
      "supplier_id",
      "purchaseRequest",
      "purchaseOrder",
      "team_id",
      "budget_id",
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

    expect(attributesMap.name).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });
    expect(attributesMap.description).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: false,
      type: DataType.STRING(255),
    });

    expect(attributesMap.year).toMatchObject({
      field: "year",
      fieldName: "year",
      allowNull: false,
      type: DataType.INTEGER(),
    });
    expect(attributesMap.amount).toMatchObject({
      field: "amount",
      fieldName: "amount",
      allowNull: false,
      type: DataType.DECIMAL(10, 2),
    });

    expect(attributesMap.type).toMatchObject({
      field: "type",
      fieldName: "type",
      allowNull: false,
      type: DataType.STRING(10),
    });

    expect(attributesMap.supplier_id).toMatchObject({
      field: "supplier_id",
      fieldName: "supplier_id",
      allowNull: true,
      type: DataType.UUID(),
    });

    expect(attributesMap.purchaseRequest).toMatchObject({
      field: "purchaseRequest",
      fieldName: "purchaseRequest",
      allowNull: true,
      type: DataType.STRING(10),
    });

    expect(attributesMap.purchaseOrder).toMatchObject({
      field: "purchaseOrder",
      fieldName: "purchaseOrder",
      allowNull: true,
      type: DataType.STRING(10),
    });

    expect(attributesMap.team_id).toMatchObject({
      field: "team_id",
      fieldName: "team_id",
      allowNull: false,
      type: DataType.UUID(),
    });

    expect(attributesMap.budget_id).toMatchObject({
      field: "budget_id",
      fieldName: "budget_id",
      allowNull: false,
      type: DataType.UUID(),
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
    let model;
    await createDependencies();
    const arrange = {
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "new entity",
      description: "new description",
      year: 2022,
      amount: 20.22,
      type: ExpenseType.CAPEX,
      supplier_id: null,
      purchaseRequest: null,
      purchaseOrder: null,
      team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
      budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
      created_by: "system",
      created_at: new Date(),
      updated_by: "system",
      updated_at: new Date(),
    };
    try {
      model = await ExpenseModel.create(arrange);
    } catch (e) {
      console.log(e);
      throw e;
    }

    expect(model.toJSON()).toStrictEqual(arrange);
  });

  async function createDependencies() {
    try {
      await TeamModel.create({
        id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
        name: "some name",
        created_at: new Date(),
        created_by: "system",
        updated_at: new Date(),
        updated_by: "system",
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    try {
      await BudgetModel.create({
        id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
        name: "some name",
        created_at: new Date(),
        created_by: "system",
        updated_at: new Date(),
        updated_by: "system",
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
});
