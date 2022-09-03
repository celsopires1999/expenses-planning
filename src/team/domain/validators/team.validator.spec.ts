import { TeamProps } from "#team/domain/entities/team";
import { TeamMemberId } from "#team/domain/entities/team-member-id.vo";
import { TeamRole } from "#team/domain/entities/team-role";
import { RoleName } from "#team/domain/validators/team-role.validator";
import TeamValidatorFactory, {
  TeamRules,
  TeamValidator,
} from "#team/domain/validators/team.validator";

describe("TeamValidator Tests", () => {
  let validator: TeamValidator;
  beforeEach(() => (validator = TeamValidatorFactory.create()));

  test("invalidation cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  describe("invalidation cases for roles field", () => {
    const arrange = [
      {
        data: { name: "some team", roles: null as any },
        message: {
          roles: [
            "roles are invalid",
            "each value in roles must be an instance of TeamRole",
            "roles should not be empty",
          ],
        },
      },
      {
        data: { name: "some team", roles: [new Date()] },
        message: {
          roles: [
            "roles are invalid",
            "each value in roles must be an instance of TeamRole",
          ],
        },
      },
      {
        data: {
          name: "some team",
          roles: [
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
          ],
        },
        message: {
          roles: ["duplicated roles with the same team member"],
        },
      },
    ];

    test.each(arrange)("Test Case: #%#", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  describe("valid cases for fields", () => {
    const arrange: TeamProps[] = [
      {
        name: "some name",
        roles: [
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
        ],
      },
      {
        name: "some name",
        roles: [
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
              name: RoleName.MANAGER,
              team_member_id: new TeamMemberId(
                "512eacd0-82b6-436b-93f9-2501bb45a32d"
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
              name: RoleName.ANALYST,
              team_member_id: new TeamMemberId(
                "512eacd0-82b6-436b-93f9-2501bb45a32d"
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
          new TeamRole(
            {
              name: RoleName.DEPUTY,
              team_member_id: new TeamMemberId(
                "512eacd0-82b6-436b-93f9-2501bb45a32d"
              ),
            },
            { created_by: "user" }
          ),
        ],
      },
    ];
    test.each(arrange)("Test Case: #%#", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new TeamRules(item));
      expect(validator.errors).toBeNull;
    });
  });
});
