import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { DataType } from "sequelize-typescript";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";

const { TeamMemberModel } = TeamMemberSequelize;

describe("TeamMemberModel Integration Tests", () => {
  setupSequelize({ models: [TeamMemberModel] });

  test("mapping attributes", () => {
    const attributesMap = TeamMemberModel.getAttributes();
    const attributes = Object.keys(TeamMemberModel.getAttributes());

    expect(attributes).toStrictEqual([
      "id",
      "name",
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
      name: "new entity",
      created_by: "system",
      created_at: new Date(),
      updated_by: "system",
      updated_at: new Date(),
    };

    const entity = await TeamMemberModel.create(arrange);

    expect(entity.toJSON()).toStrictEqual(arrange);
  });
});
