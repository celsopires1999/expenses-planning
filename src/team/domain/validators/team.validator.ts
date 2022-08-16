import {
  IsInstance,
  IsNotEmpty,
  IsString,
  MaxLength,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import { ClassValidatorFields } from "../../../@seedwork/domain/validators/class-validator-fields";
import { TeamProps } from "../entities/team";
import { TeamRole } from "../entities/team-role";
import { RoleName } from "./team-role.validator";

export class TeamRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInstance(TeamRole, { each: true })
  @HasRoles({
    message: "roles are invalid",
  })
  @IsNotDuplicated({
    message: "duplicated roles with the same team member",
  })
  roles: TeamRole[];

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export function HasRoles(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "hasRoles",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: TeamRole[]) {
          if (!Array.isArray(value)) {
            return false;
          }
          const missingRoles = Object.values(RoleName).filter((item) =>
            value.map((role) => role.name).includes(item) ? false : true
          );

          return missingRoles.length === 0;
        },
      },
    });
  };
}

export function IsNotDuplicated(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotDuplicated",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: TeamRole[]) {
          if (!Array.isArray(value)) {
            return true;
          }
          return findDuplicated(value);
        },
      },
    });
  };
}

function findDuplicated(value: TeamRole[]): boolean {
  let validTeam = true;

  for (let outerRole of value) {
    let count = 0;
    if (!(outerRole instanceof TeamRole)) {
      return validTeam;
    }
    value.forEach((innerRole) => {
      if (
        innerRole.name === outerRole.name &&
        innerRole.team_member_id.value === outerRole.team_member_id.value
      ) {
        count++;
        if (count > 1) {
          validTeam = false;
        }
      }
    });
    if (!validTeam) {
      break;
    }
  }

  return validTeam;
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
