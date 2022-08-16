import { RoleName } from "../validators/team-role.validator";
import { Team, TeamProps } from "./team";
import TeamMemberId from "./team-member-id.vo";
import { TeamRole } from "./team-role";

describe("Team Integration Tests", () => {
  describe("validations with errors", () => {
    describe("name prop", () => {
      const arrange = [
        {
          name: null as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: undefined as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "",
          message: {
            name: ["name should not be empty"],
          },
        },
        {
          name: 5,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: true,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: false,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "a".repeat(256),
          message: {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        },
      ];
      test.each(arrange)(`when name prop is "$name"`, (i) => {
        expect(
          () => new Team({ name: i.name } as any, { created_by: "user" })
        ).containsErrorMessages(i.message);
      });
    });
  });
  describe("successfull operations", () => {
    describe("should create a team", () => {
      const roles = [
        new TeamRole(
          {
            name: RoleName.MANAGER,
            team_member_id: new TeamMemberId(
              "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
            ),
          },
          { created_by: "user" }
        ),
        new TeamRole(
          {
            name: RoleName.ANALYST,
            team_member_id: new TeamMemberId(
              "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
            ),
          },
          { created_by: "user" }
        ),
        new TeamRole(
          {
            name: RoleName.DEPUTY,
            team_member_id: new TeamMemberId(
              "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
            ),
          },
          { created_by: "user" }
        ),
      ];
      const arrange: TeamProps[] = [{ name: "some name", roles }];

      test.each(arrange)("Test Case: #%#", (i) => {
        const entity = new Team(
          {
            name: i.name,
            roles: i.roles,
          },
          { created_by: "system" }
        );
        expect(entity.props).toMatchObject(i);
      });
    });
  });
});
