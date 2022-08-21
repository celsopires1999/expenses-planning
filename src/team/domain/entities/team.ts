import { Entity } from "#seedwork/domain/entity/entity";
import { AuditFieldsProps } from "#seedwork/domain/value-objects/audit-fields.vo";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { TeamValidatorFactory } from "#team/domain/validators/team.validator";
import { TeamRole } from "#team/domain/entities/team-role";

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

  change(name: string, roles: TeamRole[], updated_by: string) {
    Team.validate({ ...this.props, name, roles });
    this.name = name;
    this.roles = roles;
    super.updateAuditFields(updated_by);
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
    if (!Array.isArray(value)) {
      this.props.roles = value;
      return;
    }

    const sorted = [...value].sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }

      if (a.id > b.id) {
        return 1;
      }

      return 0;
    });

    this.props.roles = sorted;
  }

  static validate(props: TeamProps) {
    const validator = TeamValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_by: this.updated_by,
      updated_at: this.updated_at,
      roles: this.roles.map((role) => ({
        id: role.id,
        name: role.name,
        team_member_id: role.team_member_id.value,
        created_by: role.created_by,
        created_at: role.created_at,
        updated_by: role.updated_by,
        updated_at: role.updated_at,
      })),
    };
  }
}
