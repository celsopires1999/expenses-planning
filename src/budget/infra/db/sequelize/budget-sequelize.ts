import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import { Budget } from "#budget/domain/entities/budget";
import { BudgetRepository as BudgetRepositoryContract } from "#budget/domain/repository/budget-repository";
import { Op } from "sequelize";
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

export namespace BudgetSequelize {
  type BudgetModelProps = {
    id: string;
    name: string;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
  };

  @Table({ tableName: "budgets", timestamps: false })
  export class BudgetModel extends Model<BudgetModelProps> {
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
      return new SequelizeModelFactory<BudgetModel, BudgetModelProps>(
        BudgetModel,
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

  export class BudgetRepository implements BudgetRepositoryContract.Repository {
    sortableFields: string[] = ["name", "created_at"];

    constructor(private budgetModel: typeof BudgetModel) {}

    async exists(name: string): Promise<boolean> {
      const model = await this.budgetModel.findOne({
        where: { name: name },
      });

      return model ? true : false;
    }

    async search(
      props: BudgetRepositoryContract.SearchParams
    ): Promise<BudgetRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      const { rows: models, count } = await this.budgetModel.findAndCountAll({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_at", "DESC"]] }),
        offset,
        limit,
      });
      return new BudgetRepositoryContract.SearchResult({
        items: models.map((m) => BudgetModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        sort: props.sort,
        sort_dir: props.sort_dir,
        filter: props.filter,
      });
    }

    async insert(entity: Budget): Promise<void> {
      await this.budgetModel.create(entity.toJSON());
    }

    async findById(id: string | UniqueEntityId): Promise<Budget> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return BudgetModelMapper.toEntity(model);
    }

    async findAll(): Promise<Budget[]> {
      const models = await this.budgetModel.findAll();
      return models.map((m) => BudgetModelMapper.toEntity(m));
    }

    async update(entity: Budget): Promise<void> {
      await this._get(entity.id);
      await this.budgetModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);

      await this.budgetModel.destroy({
        where: { id: _id },
      });
    }

    private async _get(id: string): Promise<BudgetModel> {
      return this.budgetModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
      });
    }
  }

  export class BudgetModelMapper {
    static toEntity(model: BudgetModel): Budget {
      const {
        id,
        created_by,
        created_at,
        updated_by,
        updated_at,
        ...otherData
      } = model.toJSON();

      try {
        return new Budget(
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
