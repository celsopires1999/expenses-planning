import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { Team } from "#team/domain/entities/team";
import { TeamMemberId } from "#team/domain/entities/team-member-id.vo";
import { TeamRole } from "#team/domain/entities/team-role";
import { TeamRepository as TeamRepositoryContract } from "#team/domain/repository/team-repository";
import { RoleName } from "#team/domain/validators/team-role.validator";
import { Op } from "sequelize";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

const { TeamMemberModel } = TeamMemberSequelize;

export namespace TeamSequelize {
  type TeamModelProps = {
    id: string;
    name: string;
    roles?: TeamRoleModelProps[];
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
  };

  @Table({ tableName: "teams", timestamps: false })
  export class TeamModel extends Model<TeamModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare created_by: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare updated_by: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare updated_at: Date;

    @HasMany(() => TeamRoleModel)
    declare roles: TeamRoleModel[];

    static factory() {
      const chance: Chance.Chance = require("chance")();
      return new SequelizeModelFactory<TeamModel, TeamModelProps>(
        TeamModel,
        () => ({
          id: chance.guid({ version: 4 }),
          name: chance.word(),
          created_by: chance.word(),
          created_at: chance.date(),
          updated_by: chance.word(),
          updated_at: chance.date(),
        })
      );
    }
  }

  type TeamRoleModelProps = {
    id: string;
    name: RoleName;
    team_member_id: string;
    team_id?: string;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
  };

  @Table({ tableName: "team-roles", timestamps: false })
  export class TeamRoleModel extends Model<TeamRoleModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: RoleName;

    @ForeignKey(() => TeamMemberModel)
    @Column({ allowNull: false, type: DataType.UUID })
    declare team_member_id: string;

    @BelongsTo(() => TeamMemberModel)
    declare team_member: TeamMemberSequelize.TeamMemberModel;

    @ForeignKey(() => TeamModel)
    @Column({ allowNull: false, type: DataType.UUID })
    declare team_id: string;

    @BelongsTo(() => TeamModel)
    declare team: TeamModel;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare created_by: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare updated_by: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare updated_at: Date;

    static factory() {
      const chance: Chance.Chance = require("chance")();
      return new SequelizeModelFactory<TeamRoleModel, TeamRoleModelProps>(
        TeamRoleModel,
        () => ({
          id: chance.guid({ version: 4 }),
          name: RoleName.ANALYST,
          team_member_id: chance.guid({ version: 4 }),
          team_id: chance.guid({ version: 4 }),
          created_by: chance.word(),
          created_at: chance.date(),
          updated_by: chance.word(),
          updated_at: chance.date(),
        })
      );
    }
  }

  export class TeamRepository implements TeamRepositoryContract.Repository {
    sortableFields: string[] = ["name", "created_at"];

    constructor(private teamModel: typeof TeamModel) {}

    async exists(name: string): Promise<boolean> {
      const model = await this.teamModel.findOne({
        where: { name: name },
      });

      return model ? true : false;
    }

    async search(
      props: TeamRepositoryContract.SearchParams
    ): Promise<TeamRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      const { count } = await this.teamModel.findAndCountAll({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_at", "DESC"]] }),
        offset,
        limit,
      });

      const { rows: models } = await this.teamModel.findAndCountAll({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_at", "DESC"]] }),
        offset,
        limit,
        include: [TeamRoleModel],
      });

      return new TeamRepositoryContract.SearchResult({
        items: models.map((m) => TeamModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        sort: props.sort,
        sort_dir: props.sort_dir,
        filter: props.filter,
      });
    }

    async insert(entity: Team): Promise<void> {
      await this.teamModel.create(entity.toJSON(), {
        include: [{ model: TeamRoleModel }],
      });
    }

    async findById(id: string | UniqueEntityId): Promise<Team> {
      const _id = `${id}`;
      const model = await this.teamModel.findByPk(_id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
        include: [TeamRoleModel],
      });

      return TeamModelMapper.toEntity(model);
    }

    async findAll(): Promise<Team[]> {
      const models = await this.teamModel.findAll({ include: [TeamRoleModel] });
      return models.map((m) => TeamModelMapper.toEntity(m));
    }

    async update(entity: Team): Promise<void> {
      const sequelize = TeamModel.sequelize;

      await this._get(entity.id);

      try {
        await sequelize.transaction(async (t) => {
          await TeamRoleModel.destroy({
            where: { team_id: entity.id },
            transaction: t,
          });
          const roles = entity.roles.map((role) => {
            return {
              id: role.id,
              name: role.name,
              team_member_id: role.team_member_id.value,
              team_id: entity.id,
              created_by: role.created_by,
              created_at: role.created_at,
              updated_by: role.updated_by,
              updated_at: role.updated_at,
            };
          });
          await TeamRoleModel.bulkCreate(roles, { transaction: t });
          await TeamModel.update(entity.toJSON(), {
            where: { id: entity.id },
            transaction: t,
          });
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }

    async delete(id: string | UniqueEntityId): Promise<void> {
      const sequelize = TeamModel.sequelize;

      const _id = `${id}`;
      await this._get(_id);

      try {
        await sequelize.transaction(async (t) => {
          await TeamRoleModel.destroy({
            where: { team_id: _id },
            transaction: t,
          });
          await TeamModel.destroy({
            where: { id: _id },
            transaction: t,
          });
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }

    private async _get(id: string): Promise<TeamModel> {
      return this.teamModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
      });
    }
  }

  export class TeamModelMapper {
    static toEntity(model: TeamModel): Team {
      try {
        let roles = [];
        if (Array.isArray(model.roles)) {
          roles = model.roles.map((role) => {
            return new TeamRole(
              {
                name: role.name,
                team_member_id: new TeamMemberId(role.team_member_id),
              },
              {
                created_by: role.created_by,
                created_at: role.created_at,
                updated_by: role.updated_by,
                updated_at: role.updated_at,
              },
              new UniqueEntityId(role.id)
            );
          });
        }

        return new Team(
          { name: model.name, roles: roles },
          {
            created_by: model.created_by,
            created_at: model.created_at,
            updated_by: model.updated_by,
            updated_at: model.updated_at,
          },
          new UniqueEntityId(model.id)
        );
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }
}
