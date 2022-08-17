import { TeamMember } from "#team-member/domain/entities/team-member";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { TeamMemberModel, TeamMemberModelMapper } = TeamMemberSequelize;

describe("TeamMemberMapper Integration Test", () => {
  setupSequelize({ models: [TeamMemberModel] });

  it("should throw error when entity is invalid", () => {
    const model = TeamMemberModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      TeamMemberModelMapper.toEntity(model);
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
    const model = TeamMemberModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(TeamMember, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => TeamMemberModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a model into an entity", () => {
    const created_at = new Date();
    const model = TeamMemberModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "some entity name",
      created_by: "system",
      created_at,
    });

    const entity = TeamMemberModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new TeamMember(
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
