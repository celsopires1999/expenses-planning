import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import { Supplier } from "#supplier/domain/entities/supplier";
import { SupplierRepository as SupplierRepositoryContract } from "#supplier/domain/repository/supplier-repository";
import { Op } from "sequelize";
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

export namespace SupplierSequelize {
  type SupplierModelProps = {
    id: string;
    name: string;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
  };

  @Table({ tableName: "suppliers", timestamps: false })
  export class SupplierModel extends Model<SupplierModelProps> {
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
      return new SequelizeModelFactory<SupplierModel, SupplierModelProps>(
        SupplierModel,
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

  export class SupplierRepository
    implements SupplierRepositoryContract.Repository
  {
    sortableFields: string[] = ["name", "created_at"];

    constructor(private supplierModel: typeof SupplierModel) {}

    async exists(name: string): Promise<boolean> {
      const model = await this.supplierModel.findOne({
        where: { name: name },
      });

      return model ? true : false;
    }

    async search(
      props: SupplierRepositoryContract.SearchParams
    ): Promise<SupplierRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      const { rows: models, count } = await this.supplierModel.findAndCountAll({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_at", "DESC"]] }),
        offset,
        limit,
      });
      return new SupplierRepositoryContract.SearchResult({
        items: models.map((m) => SupplierModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        sort: props.sort,
        sort_dir: props.sort_dir,
        filter: props.filter,
      });
    }

    async insert(entity: Supplier): Promise<void> {
      await this.supplierModel.create(entity.toJSON());
    }

    async findById(id: string | UniqueEntityId): Promise<Supplier> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return SupplierModelMapper.toEntity(model);
    }

    async findAll(): Promise<Supplier[]> {
      const models = await this.supplierModel.findAll();
      return models.map((m) => SupplierModelMapper.toEntity(m));
    }

    async update(entity: Supplier): Promise<void> {
      await this._get(entity.id);
      await this.supplierModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);

      await this.supplierModel.destroy({
        where: { id: _id },
      });
    }

    private async _get(id: string): Promise<SupplierModel> {
      return this.supplierModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
      });
    }
  }

  export class SupplierModelMapper {
    static toEntity(model: SupplierModel): Supplier {
      const {
        id,
        created_by,
        created_at,
        updated_by,
        updated_at,
        ...otherData
      } = model.toJSON();

      try {
        return new Supplier(
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
