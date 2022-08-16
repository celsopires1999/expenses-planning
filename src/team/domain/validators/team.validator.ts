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
