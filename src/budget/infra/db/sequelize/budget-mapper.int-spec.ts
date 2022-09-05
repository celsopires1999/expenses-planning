import { Budget } from "#budget/domain/entities/budget";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { BudgetSequelize } from "#budget/infra/db/sequelize/budget-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { BudgetModel, BudgetModelMapper } = BudgetSequelize;

describe("BudgetMapper Integration Test", () => {
  setupSequelize({ models: [BudgetModel] });

  it("should throw error when entity is invalid", () => {
    const model = BudgetModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      BudgetModelMapper.toEntity(model);
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
    const model = BudgetModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(Budget, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => BudgetModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a model into an entity", () => {
    const created_at = new Date();
    const model = BudgetModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "some entity name",
      created_by: "system",
      created_at,
    });

    const entity = BudgetModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new Budget(
        {
          name: "some entity name",
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
