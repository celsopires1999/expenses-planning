import { TeamProps as TeamProps } from "../entities/team";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ClassValidatorFields } from "../../../@seedwork/domain/validators/class-validator-fields";

export class TeamRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class TeamValidator extends ClassValidatorFields<TeamRules> {
  validate(data: TeamProps): boolean {
    return super.validate(new TeamRules(data));
  }
}

export class TeamValidatorFactory {
  static create(): TeamValidator {
    return new TeamValidator();
  }
}

export default TeamValidatorFactory;
