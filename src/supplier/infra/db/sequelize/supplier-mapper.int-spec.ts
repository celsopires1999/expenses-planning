import { Supplier } from "#supplier/domain/entities/supplier";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { SupplierSequelize } from "#supplier/infra/db/sequelize/supplier-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { SupplierModel, SupplierModelMapper } = SupplierSequelize;

describe("SupplierMapper Integration Test", () => {
  setupSequelize({ models: [SupplierModel] });

  it("should throw error when entity is invalid", () => {
    const model = SupplierModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      SupplierModelMapper.toEntity(model);
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
    const model = SupplierModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(Supplier, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => SupplierModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a model into an entity", () => {
    const created_at = new Date();
    const model = SupplierModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "some entity name",
      created_by: "system",
      created_at,
    });

    const entity = SupplierModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new Supplier(
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
