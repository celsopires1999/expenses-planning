import { BudgetSequelize } from "#budget/infra/db/sequelize/budget-sequelize";
import { BudgetId } from "#expense/domain/entities/budget-id.vo";
import { Expense } from "#expense/domain/entities/expense";
import { TeamId } from "#expense/domain/entities/team-id.vo";
import { ExpenseType } from "#expense/domain/validators/expense.validator";
import { ExpenseSequelize } from "#expense/infra/db/sequelize/expense-sequelize";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { SupplierSequelize } from "#supplier/infra/db/sequelize/supplier-sequelize";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";

const { ExpenseModel, ExpenseModelMapper } = ExpenseSequelize;
const { SupplierModel } = SupplierSequelize;
const { TeamModel, TeamRoleModel } = TeamSequelize;
const { TeamMemberModel } = TeamMemberSequelize;
const { BudgetModel } = BudgetSequelize;

describe("ExpenseMapper Integration Test", () => {
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

  it("should throw error when entity is invalid", () => {
    const model = ExpenseModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      ExpenseModelMapper.toEntity(model);
      fail("The entity has not thrown a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const model = ExpenseModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(Expense, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => ExpenseModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a model into an entity", () => {
    const created_at = new Date();
    const model = ExpenseModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "some entity name",
      description: "some entity description",
      year: 2022,
      amount: 20.22,
      type: ExpenseType.OPEX,
      supplier_id: null,
      purchaseRequest: null,
      purchaseOrder: null,
      team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
      budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
      created_by: "system",
      created_at,
    });

    const entity = ExpenseModelMapper.toEntity(model);

    const expectedEntity = new Expense(
      {
        name: "some entity name",
        description: "some entity description",
        year: 2022,
        amount: 20.22,
        type: ExpenseType.OPEX,
        supplier_id: null,
        purchaseRequest: null,
        purchaseOrder: null,
        team_id: new TeamId("2bcaaafd-6b55-4a60-98ee-f78b352ee7d8"),
        budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
      },
      {
        created_by: "system",
        created_at,
        updated_by: "system",
        updated_at: created_at,
      },
      new UniqueEntityId("312cffad-1938-489e-a706-643dc9a3cfd3")
    );

    expect(JSON.stringify(entity)).toStrictEqual(
      JSON.stringify(expectedEntity)
    );
  });
});
