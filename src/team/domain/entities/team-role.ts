import { Entity } from "../../../@seedwork/domain/entity/entity";
import { AuditFieldsProps } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { UniqueEntityId } from "../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation.error";
import { TeamValidatorFactory } from "../validators/team.validator";

export interface TeamRoleProps {
  name: string;
}

export class TeamRole extends Entity<TeamRoleProps> {
  constructor(
    public readonly props: TeamRoleProps,
    auditFields: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    TeamRole.validate(props);
    super(props, auditFields, id);
    this.name = this.props.name;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  static validate(props: TeamRoleProps) {
    const validator = TeamValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
