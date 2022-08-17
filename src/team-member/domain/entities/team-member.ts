import { Entity } from "#seedwork/domain/entity/entity";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { AuditFieldsProps } from "#seedwork/domain/value-objects/audit-fields.vo";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { TeamMemberValidatorFactory } from "#team-member/domain/validators/team-member.validator";

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
    const validator = TeamMemberValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
