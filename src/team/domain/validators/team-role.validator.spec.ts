import TeamMemberId from "../entities/team-member-id.vo";
import { TeamRoleProps } from "./../../domain/entities/team-role";
import {
  RoleName,
  TeamRoleRules,
  TeamRoleValidator,
  TeamRoleValidatorFactory,
} from "./team-role.validator";

describe("TeamRoleValidator Tests", () => {
  let validator: TeamRoleValidator;
  beforeEach(() => (validator = TeamRoleValidatorFactory.create()));

  test("invalidation cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: ["name should not be empty", "name must be a valid enum value"],
    });

    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: ["name should not be empty", "name must be a valid enum value"],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty", "name must be a valid enum value"],
    });

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: ["name must be a valid enum value"],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be a valid enum value"],
    });
  });

  describe("valid cases for fields", () => {
    const team_member_id = new TeamMemberId(
      "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
    );
    const arrange: TeamRoleProps[] = [
      { name: RoleName.MANAGER, team_member_id },
      { name: RoleName.ANALYST, team_member_id },
      { name: RoleName.DEPUTY, team_member_id },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new TeamRoleRules(item));
      expect(validator.errors).toBeNull;
    });
  });
});
