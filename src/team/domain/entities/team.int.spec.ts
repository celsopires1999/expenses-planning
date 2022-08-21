import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { Team, TeamProps } from "#team/domain/entities/team";
import { TeamMemberId } from "#team/domain/entities/team-member-id.vo";
import { TeamRole } from "#team/domain/entities/team-role";
import { RoleName } from "#team/domain/validators/team-role.validator";
import { cloneDeep } from "lodash";

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
      const roles = createRoles();
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

    it("should convert an entity to JSON", () => {
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

      const entity = new Team(
        {
          name: "some team",
          roles,
        },
        { created_by: "system" }
      );

      expect(entity.toJSON()).toBeDefined();
    });

    it("should change an entity", () => {
      let roles = createRoles();
      const entity = new Team(
        { name: "good team", roles },
        { created_by: "system" }
      );

      const newRole = new TeamRole(
        {
          name: RoleName.MANAGER,
          team_member_id: new TeamMemberId(
            "96e91752-98fc-411f-8fc7-be7f1739e713"
          ),
        },
        { created_by: "user" },
        new UniqueEntityId("96e91752-98fc-411f-8fc7-be7f1739e713")
      );

      roles.push(newRole);
      const oldEntity = cloneDeep(entity);
      entity.change("wonderful team", roles, "system");

      expect(entity.name).toBe("wonderful team");
      expect(entity.roles.length).toBe(4);
      expect(entity.roles[0]).toStrictEqual(newRole);
      expect(entity.updated_by).toBe("system");
      expect(entity.roles[1]).toStrictEqual(oldEntity.roles[0]);
      expect(entity.roles[2]).toStrictEqual(oldEntity.roles[1]);
      expect(entity.roles[3]).toStrictEqual(oldEntity.roles[2]);
      expect(entity.created_by).toBe(oldEntity.created_by);
      expect(entity.created_at).toStrictEqual(oldEntity.created_at);
      expect(entity.updated_at.getTime()).not.toBeLessThan(
        oldEntity.updated_at.getTime()
      );
    });
  });

  function createRoles(): TeamRole[] {
    return [
      new TeamRole(
        {
          name: RoleName.MANAGER,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" },
        new UniqueEntityId("a338296b-0b2e-4fdd-90b7-047302b47a1f")
      ),
      new TeamRole(
        {
          name: RoleName.ANALYST,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" },
        new UniqueEntityId("b388ce18-ae3a-4aed-a828-35f390b40828")
      ),
      new TeamRole(
        {
          name: RoleName.DEPUTY,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" },
        new UniqueEntityId("c2fded76-5ef8-4774-bdcf-e28456634848")
      ),
    ];
  }
});
