import { AuditFieldsProps } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { TeamValidatorFactory } from "../validators/team.validator";
import { Entity } from "../../../@seedwork/domain/entity/entity";
import { UniqueEntityId } from "../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { TeamValidationError } from "../../../@seedwork/domain/errors/validation.error";

export interface TeamProps {
  name: string;
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
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  static validate(props: TeamProps) {
    const validator = TeamValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new TeamValidationError(validator.errors);
    }
  }
}
