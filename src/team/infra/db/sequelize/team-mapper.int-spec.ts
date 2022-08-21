import { Team } from "#team/domain/entities/team";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { RoleName } from "#team/domain/validators/team-role.validator";
import { TeamRole } from "#team/domain/entities/team-role";
import { TeamMemberId } from "#team/domain/entities/team-member-id.vo";

const { TeamModel, TeamRoleModel, TeamModelMapper } = TeamSequelize;
const { TeamMemberModel } = TeamMemberSequelize;

describe("TeamMapper Integration Test", () => {
  setupSequelize({ models: [TeamModel, TeamRoleModel, TeamMemberModel] });
  it("should throw error when entity has just one role", () => {
    const teamModel = TeamModel.build(
      {
        id: "312cffad-1938-489e-a706-643dc9a3cfd3",
        name: "some name",
        roles: [
          {
            id: "312cffad-1938-489e-a706-643dc9a3cfd3",
            name: RoleName.ANALYST,
            team_member_id: "312cffad-1938-489e-a706-643dc9a3cfd3",
            team_id: "312cffad-1938-489e-a706-643dc9a3cfd3",
            created_by: "user",
            created_at: new Date(),
            updated_by: "user",
            updated_at: new Date(),
          },
        ],
      },
      { include: [{ model: TeamRoleModel }] }
    );

    try {
      TeamModelMapper.toEntity(teamModel);
      fail("The entity has not thrown a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        roles: ["roles are invalid"],
      });
    }
  });
  it("should throw error when entity is invalid", () => {
    const teamModel = TeamModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      TeamModelMapper.toEntity(teamModel);
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

  it("should convert a model into an entity", () => {
    const created_at = new Date();
    const teamModel = TeamModel.build(
      {
        id: "312cffad-1938-489e-a706-643dc9a3cfd3",
        name: "some entity name",
        created_by: "system",
        created_at,
        updated_by: "system",
        updated_at: created_at,
        roles: Object.values(RoleName).map((name) => {
          return {
            id: "312cffad-1938-489e-a706-643dc9a3cfd3",
            name,
            created_by: "system",
            created_at,
            updated_by: "system",
            updated_at: created_at,
            team_member_id: "312cffad-1938-489e-a706-643dc9a3cfd3",
            team_id: "312cffad-1938-489e-a706-643dc9a3cfd3",
          };
        }),
      },
      { include: [TeamRoleModel] }
    );

    const entity = TeamModelMapper.toEntity(teamModel);

    const expectedEntity = new Team(
      {
        name: "some entity name",
        roles: Object.values(RoleName).map((name) => {
          return new TeamRole(
            {
              name,
              team_member_id: new TeamMemberId(
                "312cffad-1938-489e-a706-643dc9a3cfd3"
              ),
            },
            {
              created_by: "system",
              created_at,
              updated_by: "system",
              updated_at: created_at,
            },
            new UniqueEntityId("312cffad-1938-489e-a706-643dc9a3cfd3")
          );
        }),
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
