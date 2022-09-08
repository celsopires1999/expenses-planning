import { BudgetSequelize } from "#budget/infra/db/sequelize/budget-sequelize";
import { BudgetId } from "#expense/domain/entities/budget-id.vo";
import { Expense } from "#expense/domain/entities/expense";
import { Invoice, InvoiceProps } from "#expense/domain/entities/invoice";
import { SupplierId } from "#expense/domain/entities/supplier-id.vo";
import { TeamId } from "#expense/domain/entities/team-id.vo";
import { ExpenseRepository as ExpenseRepositoryContract } from "#expense/domain/repository/expense-repository";
import { ExpenseType } from "#expense/domain/validators/expense.validator";
import { InvoiceSequelize } from "#expense/infra/db/sequelize/invoice-sequelize";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import { SupplierSequelize } from "#supplier/infra/db/sequelize/supplier-sequelize";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
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

const { SupplierModel } = SupplierSequelize;
const { TeamModel } = TeamSequelize;
const { BudgetModel } = BudgetSequelize;

export namespace ExpenseSequelize {
  type ExpenseModelProps = {
    id: string;
    name: string;
    description: string;
    year: number;
    amount: number;
    type: ExpenseType;
    supplier_id?: string;
    purchaseRequest?: string;
    purchaseOrder?: string;
    team_id: string;
    budget_id: string;
    invoices?: InvoiceProps[];
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
  };

  @Table({ tableName: "expenses", timestamps: false })
  export class ExpenseModel extends Model<ExpenseModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID() })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare description: string;

    @Column({ allowNull: false, type: DataType.INTEGER() })
    declare year: number;

    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
    declare amount: number;

    @Column({ allowNull: false, type: DataType.STRING(10) })
    declare type: ExpenseType;

    @ForeignKey(() => SupplierModel)
    @Column({ allowNull: true, type: DataType.UUID() })
    declare supplier_id: string;

    @BelongsTo(() => SupplierModel)
    declare supplier: SupplierSequelize.SupplierModel;

    @Column({ allowNull: true, type: DataType.STRING(10) })
    declare purchaseRequest: string;

    @Column({ allowNull: true, type: DataType.STRING(10) })
    declare purchaseOrder: string;

    @ForeignKey(() => TeamModel)
    @Column({ allowNull: false, type: DataType.UUID() })
    declare team_id: string;

    @BelongsTo(() => TeamModel)
    declare team: TeamSequelize.TeamModel;

    @ForeignKey(() => BudgetModel)
    @Column({ allowNull: false, type: DataType.UUID() })
    declare budget_id: string;

    @BelongsTo(() => BudgetModel)
    declare budget: BudgetSequelize.BudgetModel;

    @HasMany(() => InvoiceSequelize.InvoiceModel)
    declare invoices: InvoiceSequelize.InvoiceModel[];

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare created_by: string;

    @Column({ allowNull: false, type: DataType.DATE() })
    declare created_at: Date;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare updated_by: string;

    @Column({ allowNull: false, type: DataType.DATE() })
    declare updated_at: Date;

    static factory() {
      const chance: Chance.Chance = require("chance")();
      return new SequelizeModelFactory<ExpenseModel, ExpenseModelProps>(
        ExpenseModel,
        () => ({
          id: chance.guid({ version: 4 }),
          name: chance.word(),
          description: chance.word(),
          year: +chance.year(),
          amount: +chance.dollar(),
          created_by: chance.word(),
          type: ExpenseType.CAPEX,
          supplier_id: null,
          purchaseRequest: null,
          purchaseOrder: null,
          team_id: chance.guid({ version: 4 }),
          budget_id: chance.guid({ version: 4 }),
          created_at: chance.date(),
          updated_by: chance.word(),
          updated_at: chance.date(),
        })
      );
    }
  }

  export class ExpenseRepository
    implements ExpenseRepositoryContract.Repository
  {
    sortableFields: string[] = ["name", "created_at"];

    constructor(
      private expenseModel: typeof ExpenseModel,
      private invoiceModel: typeof InvoiceSequelize.InvoiceModel
    ) {}

    async exists(name: string): Promise<boolean> {
      const model = await this.expenseModel.findOne({
        where: { name: name },
      });

      return model ? true : false;
    }

    async search(
      props: ExpenseRepositoryContract.SearchParams
    ): Promise<ExpenseRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      const count = await this.expenseModel.count({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
      });

      let models = [];
      if (count !== 0) {
        models = await this.expenseModel.findAll({
          ...(props.filter && {
            where: { name: { [Op.like]: `%${props.filter}%` } },
          }),
          ...(props.sort && this.sortableFields.includes(props.sort)
            ? { order: [[props.sort, props.sort_dir]] }
            : { order: [["created_at", "DESC"]] }),
          offset,
          limit,
          include: [this.invoiceModel],
        });
      }

      return new ExpenseRepositoryContract.SearchResult({
        items: models.map((m) => ExpenseModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        sort: props.sort,
        sort_dir: props.sort_dir,
        filter: props.filter,
      });
    }

    async insert(entity: Expense): Promise<void> {
      entity.invoices
        ? await this.expenseModel.create(entity.toJSON(), {
            include: [{ model: this.invoiceModel }],
          })
        : await this.expenseModel.create(entity.toJSON());
    }

    async findById(id: string | UniqueEntityId): Promise<Expense> {
      const _id = `${id}`;

      const model = await this.expenseModel.findByPk(_id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
        include: [this.invoiceModel],
      });

      return ExpenseModelMapper.toEntity(model);
    }

    async findAll(): Promise<Expense[]> {
      const models = await this.expenseModel.findAll({
        include: [this.invoiceModel],
      });
      return models.map((m) => ExpenseModelMapper.toEntity(m));
    }

    async update(entity: Expense): Promise<void> {
      const sequelize = this.expenseModel.sequelize;
      await this._get(entity.id);

      try {
        await sequelize.transaction(async (t) => {
          await this.invoiceModel.destroy({
            where: { expense_id: entity.id },
            transaction: t,
          });

          if (entity.invoices) {
            const invoices = entity.invoices.map((invoice) => {
              return {
                id: invoice.id,
                expense_id: entity.id,
                amount: invoice.amount,
                date: invoice.date,
                status: invoice.status,
                document: invoice.document,
                created_by: invoice.created_by,
                created_at: invoice.created_at,
                updated_by: invoice.updated_by,
                updated_at: invoice.updated_at,
              };
            });
            await this.invoiceModel.bulkCreate(invoices, { transaction: t });
          }
          await this.expenseModel.update(entity.toJSON(), {
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
      const sequelize = this.expenseModel.sequelize;

      const _id = `${id}`;
      await this._get(_id);

      try {
        await sequelize.transaction(async (t) => {
          await this.invoiceModel.destroy({
            where: { expense_id: _id },
            transaction: t,
          });
          await this.expenseModel.destroy({
            where: { id: _id },
            transaction: t,
          });
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }

    private async _get(id: string): Promise<ExpenseModel> {
      return this.expenseModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
      });
    }
  }

  export class ExpenseModelMapper {
    static toEntity(model: ExpenseModel): Expense {
      const {
        id,
        name,
        description,
        year,
        amount,
        type,
        supplier_id,
        purchaseRequest,
        purchaseOrder,
        team_id,
        budget_id,
        created_by,
        created_at,
        updated_by,
        updated_at,
      } = model.toJSON();

      try {
        let invoices = null;
        if (Array.isArray(model.invoices)) {
          invoices = model.invoices.map((invoice) => {
            return new Invoice(
              {
                amount: invoice.amount,
                date: invoice.date,
                status: invoice.status,
                document: invoice.document,
              },
              {
                created_by: invoice.created_by,
                created_at: invoice.created_at,
                updated_by: invoice.updated_by,
                updated_at: invoice.updated_at,
              },
              new UniqueEntityId(invoice.id)
            );
          });
        }
        return new Expense(
          {
            name,
            description,
            year,
            amount,
            type,
            supplier_id: supplier_id ? new SupplierId(supplier_id) : null,
            purchaseRequest,
            purchaseOrder,
            team_id: team_id ? new TeamId(team_id) : null,
            budget_id: budget_id ? new BudgetId(budget_id) : null,
            invoices,
          },
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
