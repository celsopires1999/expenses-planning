import { Entity } from "../../../@seedwork/domain/entity/entity";
import { AuditFieldsProps } from "../../../@seedwork/domain/value-objects/audit-fields.vo";
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation.error";
import {
  RoleName,
  TeamRoleValidatorFactory,
} from "./../validators/team-role.validator";
import { TeamMemberId } from "./team-member-id.vo";
export interface TeamRoleProps {
  name: RoleName;
  team_member_id: TeamMemberId;
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
    this.team_member_id = this.props.team_member_id;
  }

  get name(): RoleName {
    return this.props.name;
  }

  private set name(value: RoleName) {
    this.props.name = value;
  }

  get team_member_id(): TeamMemberId {
    return this.props.team_member_id;
  }

  private set team_member_id(value: TeamMemberId) {
    this.props.team_member_id = value;
  }
  static validate(props: TeamRoleProps) {
    const validator = TeamRoleValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
