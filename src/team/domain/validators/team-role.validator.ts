import { TeamMemberProps as TeamRoleProps } from "../entities/team-member";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ClassValidatorFields } from "../../../@seedwork/domain/validators/class-validator-fields";

export class TeamRoleRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class TeamRoleValidator extends ClassValidatorFields<TeamRoleRules> {
  validate(data: TeamRoleProps): boolean {
    return super.validate(new TeamRoleRules(data));
  }
}

export class TeamMemberValidatorFactory {
  static create(): TeamRoleValidator {
    return new TeamRoleValidator();
  }
}

export default TeamMemberValidatorFactory;
