import { RoleName } from "#team/domain/validators/team-role.validator";
import { TeamMemberId } from "#team/domain/entities/team-member-id.vo";
import { TeamRole, TeamRoleProps } from "#team/domain/entities/team-role";

describe("TeamRole Integration Tests", () => {
  describe("validations with errors", () => {
    describe("name prop", () => {
      const arrange = [
        {
          name: null as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a valid enum value",
            ],
          },
        },
        {
          name: undefined as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a valid enum value",
            ],
          },
        },
        {
          name: "",
          message: {
            name: [
              "name should not be empty",
              "name must be a valid enum value",
            ],
          },
        },
        {
          name: 5,
          message: {
            name: ["name must be a valid enum value"],
          },
        },
        {
          name: true,
          message: {
            name: ["name must be a valid enum value"],
          },
        },
        {
          name: false,
          message: {
            name: ["name must be a valid enum value"],
          },
        },
        {
          name: "a".repeat(256),
          message: {
            name: ["name must be a valid enum value"],
          },
        },
      ];
      test.each(arrange)(`when name prop is "$name"`, (i) => {
        expect(
          () => new TeamRole({ name: i.name } as any, { created_by: "user" })
        ).containsErrorMessages(i.message);
      });
    });
  });
  describe("successfull operations", () => {
    describe("should create a team role", () => {
      const arrange: TeamRoleProps[] = [
        {
          name: RoleName.ANALYST,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
      ];

      test.each(arrange)("Test Case: #%#", (i) => {
        const entity = new TeamRole(
          {
            name: i.name,
            team_member_id: i.team_member_id,
          },
          { created_by: "system" }
        );
        expect(entity.props).toMatchObject(i);
      });
    });
  });
});
