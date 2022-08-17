import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import { TeamMember } from "#team-member/domain/entities/team-member";
import { TeamMemberRepository as TeamMemberRepositoryContract } from "#team-member/domain/repository/team-member-repository";
import { Op } from "sequelize";
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

export namespace TeamMemberSequelize {
  type TeamMemberModelProps = {
    id: string;
    name: string;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
  };

  @Table({ tableName: "team-members", timestamps: false })
  export class TeamMemberModel extends Model<TeamMemberModelProps> {
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

    static factory() {
      const chance: Chance.Chance = require("chance")();
      return new SequelizeModelFactory<TeamMemberModel, TeamMemberModelProps>(
        TeamMemberModel,
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

  export class TeamMemberRepository
    implements TeamMemberRepositoryContract.Repository
  {
    sortableFields: string[] = ["name", "created_at"];

    constructor(private teamMemberModel: typeof TeamMemberModel) {}

    async exists(name: string): Promise<boolean> {
      const model = await this.teamMemberModel.findOne({
        where: { name: name },
      });

      return model ? true : false;
    }

    async search(
      props: TeamMemberRepositoryContract.SearchParams
    ): Promise<TeamMemberRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      const { rows: models, count } =
        await this.teamMemberModel.findAndCountAll({
          ...(props.filter && {
            where: { name: { [Op.like]: `%${props.filter}%` } },
          }),
          ...(props.sort && this.sortableFields.includes(props.sort)
            ? { order: [[props.sort, props.sort_dir]] }
            : { order: [["created_at", "DESC"]] }),
          offset,
          limit,
        });
      return new TeamMemberRepositoryContract.SearchResult({
        items: models.map((m) => TeamMemberModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        sort: props.sort,
        sort_dir: props.sort_dir,
        filter: props.filter,
      });
    }

    async insert(entity: TeamMember): Promise<void> {
      await this.teamMemberModel.create(entity.toJSON());
    }

    async findById(id: string | UniqueEntityId): Promise<TeamMember> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return TeamMemberModelMapper.toEntity(model);
    }

    async findAll(): Promise<TeamMember[]> {
      const models = await this.teamMemberModel.findAll();
      return models.map((m) => TeamMemberModelMapper.toEntity(m));
    }

    async update(entity: TeamMember): Promise<void> {
      await this._get(entity.id);
      await this.teamMemberModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);

      await this.teamMemberModel.destroy({
        where: { id: _id },
      });
    }

    private async _get(id: string): Promise<TeamMemberModel> {
      return this.teamMemberModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
      });
    }
  }

  export class TeamMemberModelMapper {
    static toEntity(model: TeamMemberModel): TeamMember {
      const {
        id,
        created_by,
        created_at,
        updated_by,
        updated_at,
        ...otherData
      } = model.toJSON();

      try {
        return new TeamMember(
          otherData,
          { created_by, created_at, updated_by, updated_at },
          new UniqueEntityId(id)
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
