import { Invoice } from "#expense/domain/entities/invoice";
import { InvoiceStatus } from "#expense/domain/validators/invoice.validator";
import { ExpenseSequelize } from "#expense/infra/db/sequelize/expense-sequelize";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { EntityValidationError } from "#seedwork/domain/errors/validation.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

export namespace InvoiceSequelize {
  type InvoiceModelProps = {
    id: string;
    expense_id: string;
    amount: number;
    date: Date;
    document?: string;
    status: InvoiceStatus;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
  };

  @Table({ tableName: "invoices", timestamps: false })
  export class InvoiceModel extends Model<InvoiceModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => ExpenseSequelize.ExpenseModel)
    @Column({ allowNull: false, type: DataType.UUID })
    declare expense_id: string;

    @BelongsTo(() => ExpenseSequelize.ExpenseModel)
    declare expense: ExpenseSequelize.ExpenseModel;

    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
    declare amount: number;

    @Column({ allowNull: false, type: DataType.DATE })
    declare date: Date;

    @Column({ allowNull: true, type: DataType.STRING(10) })
    declare document: string;

    @Column({ allowNull: false, type: DataType.STRING(10) })
    declare status: InvoiceStatus;

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
      return new SequelizeModelFactory<InvoiceModel, InvoiceModelProps>(
        InvoiceModel,
        () => ({
          id: chance.guid({ version: 4 }),
          expense_id: chance.guid({ version: 4 }),
          amount: chance.d6(),
          date: chance.date(),
          document: chance.animal(),
          status: InvoiceStatus.ACTUAL,
          created_by: chance.word(),
          created_at: chance.date(),
          updated_by: chance.word(),
          updated_at: chance.date(),
        })
      );
    }
  }

  export class InvoiceModelMapper {
    static toEntity(model: InvoiceModel): Invoice {
      const {
        id,
        created_by,
        created_at,
        updated_by,
        updated_at,
        ...otherData
      } = model.toJSON();

      try {
        return new Invoice(
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
