import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { DataType } from "sequelize-typescript";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { RoleName } from "#team/domain/validators/team-role.validator";

const { TeamModel, TeamRoleModel } = TeamSequelize;
const { TeamMemberModel } = TeamMemberSequelize;

describe("TeamModel Integration Tests", () => {
  setupSequelize({
    models: [TeamModel, TeamRoleModel, TeamMemberModel],
  });

  test("TeamModel mapping attributes", () => {
    const attributesMap = TeamModel.getAttributes();
    const attributes = Object.keys(TeamModel.getAttributes());

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

  test("TeamRoleModel mapping attributes", () => {
    const attributesMap = TeamRoleModel.getAttributes();
    const attributes = Object.keys(TeamRoleModel.getAttributes());

    expect(attributes).toStrictEqual([
      "id",
      "name",
      "team_member_id",
      "team_id",
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

    expect(attributesMap.team_member_id).toMatchObject({
      field: "team_member_id",
      fieldName: "team_member_id",
      allowNull: false,
      type: DataType.UUID(),
    });

    expect(attributesMap.team_id).toMatchObject({
      field: "team_id",
      fieldName: "team_id",
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
    createTeam();
    createTeamMember();
    createTeamRole();

    async function createTeam() {
      const arrange = {
        id: "312cffad-1938-489e-a706-643dc9a3cfd3",
        name: "new team",
        created_by: "system",
        created_at: new Date(),
        updated_by: "system",
        updated_at: new Date(),
      };
      const entity = await TeamModel.create(arrange);
      expect(entity.toJSON()).toStrictEqual(arrange);
    }

    async function createTeamMember() {
      const arrange = {
        id: "312cffad-1938-489e-a706-643dc9a3cfd3",
        name: "new team member",
        created_by: "system",
        created_at: new Date(),
        updated_by: "system",
        updated_at: new Date(),
      };
      const entity = await TeamMemberModel.create(arrange);
      expect(entity.toJSON()).toStrictEqual(arrange);
    }

    async function createTeamRole() {
      const arrange = {
        id: "312cffad-1938-489e-a706-643dc9a3cfd3",
        name: RoleName.ANALYST,
        team_member_id: "312cffad-1938-489e-a706-643dc9a3cfd3",
        team_id: "312cffad-1938-489e-a706-643dc9a3cfd3",
        created_by: "system",
        created_at: new Date(),
        updated_by: "system",
        updated_at: new Date(),
      };
      const entity = await TeamRoleModel.create(arrange);
      expect(entity.toJSON()).toStrictEqual(arrange);
    }
  });
});
