import {
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
} from "class-validator";
import { ClassValidatorFields } from "#seedwork/domain/validators/class-validator-fields";
import { TeamRoleProps } from "#team/domain/entities/team-role";
import { TeamMemberId } from "#team/domain/entities/team-member-id.vo";

export enum RoleName {
  MANAGER = "manager",
  ANALYST = "analyst",
  DEPUTY = "deputy",
}
export class TeamRoleRules {
  @IsEnum(RoleName)
  @IsNotEmpty()
  name: RoleName;

  @IsNotEmptyObject()
  @IsOptional()
  @IsInstance(TeamMemberId)
  team_member_id: TeamMemberId;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class TeamRoleValidator extends ClassValidatorFields<TeamRoleRules> {
  validate(data: TeamRoleProps): boolean {
    return super.validate(new TeamRoleRules(data));
  }
}

export class TeamRoleValidatorFactory {
  static create(): TeamRoleValidator {
    return new TeamRoleValidator();
  }
}

export default TeamRoleValidatorFactory;
