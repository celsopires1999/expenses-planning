import { ClassValidatorFields } from "#seedwork/domain/validators/class-validator-fields";
import { TeamMemberProps } from "#team-member/domain/entities/team-member";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class TeamMemberRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class TeamMemberValidator extends ClassValidatorFields<TeamMemberRules> {
  validate(data: TeamMemberProps): boolean {
    return super.validate(new TeamMemberRules(data));
  }
}

export class TeamMemberValidatorFactory {
  static create(): TeamMemberValidator {
    return new TeamMemberValidator();
  }
}

export default TeamMemberValidatorFactory;
