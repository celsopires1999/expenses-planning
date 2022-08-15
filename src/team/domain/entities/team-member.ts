import { Entity } from "../../../@seedwork/domain/entity/entity";
import { AuditFieldsProps } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { UniqueEntityId } from "../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation.error";
import { TeamValidatorFactory } from "../validators/team.validator";

export interface TeamMemberProps {
  name: string;
}

export class TeamMember extends Entity<TeamMemberProps> {
  constructor(
    public readonly props: TeamMemberProps,
    auditFields: AuditFieldsProps,
    id?: UniqueEntityId
  ) {
    TeamMember.validate(props);
    super(props, auditFields, id);
    this.name = this.props.name;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  static validate(props: TeamMemberProps) {
    const validator = TeamValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
