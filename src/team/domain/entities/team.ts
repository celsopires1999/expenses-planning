import { Entity } from "../../../@seedwork/domain/entity/entity";
import { AuditFieldsProps } from "../../../@seedwork/domain/value-objects/audit-fields.vo";
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation.error";
// import { TeamValidationError } from "../errors/team-validation.error";
import { TeamValidatorFactory } from "../validators/team.validator";
import { TeamRole } from "./team-role";

export interface TeamProps {
  name: string;
  roles: TeamRole[];
}

export class Team extends Entity<TeamProps> {
  constructor(
    public readonly props: TeamProps,
    auditFields: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    Team.validate(props);
    super(props, auditFields, id);
    this.name = this.props.name;
    this.roles = this.props.roles;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get roles(): TeamRole[] {
    return this.props.roles;
  }

  private set roles(value: TeamRole[]) {
    this.props.roles = value;
  }

  static validate(props: TeamProps) {
    const validator = TeamValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
