import { BudgetSequelize } from "#budget/infra/db/sequelize/budget-sequelize";
import { BudgetId } from "#expense/domain/entities/budget-id.vo";
import { Expense } from "#expense/domain/entities/expense";
import { Invoice } from "#expense/domain/entities/invoice";
import { SupplierId } from "#expense/domain/entities/supplier-id.vo";
import { TeamId } from "#expense/domain/entities/team-id.vo";
import { ExpenseRepository } from "#expense/domain/repository/expense-repository";
import { ExpenseType } from "#expense/domain/validators/expense.validator";
import { InvoiceStatus } from "#expense/domain/validators/invoice.validator";
import { ExpenseSequelize } from "#expense/infra/db/sequelize/expense-sequelize";
import { InvoiceSequelize } from "#expense/infra/db/sequelize/invoice-sequelize";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { SupplierSequelize } from "#supplier/infra/db/sequelize/supplier-sequelize";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
import _chance from "chance";

const chance = _chance();

const { ExpenseModel, ExpenseModelMapper } = ExpenseSequelize;
const { SupplierModel } = SupplierSequelize;
const { TeamModel, TeamRoleModel } = TeamSequelize;
const { TeamMemberModel } = TeamMemberSequelize;
const { BudgetModel } = BudgetSequelize;
const { InvoiceModel } = InvoiceSequelize;

describe("ExpenseSequelizeRepository Integration Tests", () => {
  setupSequelize({
    models: [
      ExpenseModel,
      SupplierModel,
      TeamModel,
      TeamRoleModel,
      TeamMemberModel,
      BudgetModel,
      InvoiceModel,
    ],
  });

  let repository: ExpenseSequelize.ExpenseRepository;

  beforeEach(async () => {
    repository = new ExpenseSequelize.ExpenseRepository(
      ExpenseModel,
      InvoiceModel
    );
  });

  const entityProps = {
    name: "some entity name",
    description: "some entity description",
    year: 2022,
    amount: 20.22,
    type: ExpenseType.OPEX,
    supplier_id: new SupplierId("2bcaaafd-6b55-4a60-98ee-f78b352ee7d8"),
    purchaseRequest: "1234567890",
    purchaseOrder: "1234567890",
    team_id: new TeamId("2bcaaafd-6b55-4a60-98ee-f78b352ee7d8"),
    budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
  };

  const invoices = [
    new Invoice(
      {
        amount: 55.55,
        date: new Date(),
        status: InvoiceStatus.ACTUAL,
        document: "FAT4711",
      },
      { created_by: "system" }
    ),
    new Invoice(
      {
        amount: 77.77,
        date: new Date(),
        status: InvoiceStatus.PLAN,
      },
      { created_by: "system" }
    ),
  ];

  it("should insert a new entity", async () => {
    let entity = new Expense(entityProps, { created_by: "system" });
    await createDependencies();
    await repository.insert(entity);
    let model = await ExpenseModel.findByPk(entity.id);
    let foundEntity = ExpenseModelMapper.toEntity(model);

    expect(JSON.parse(JSON.stringify(foundEntity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(entity.toJSON()))
    );

    entity = new Expense(
      {
        name: "new entity",
        description: "some entity description",
        year: 2022,
        amount: 20.22,
        type: ExpenseType.OPEX,
        supplier_id: null,
        purchaseRequest: null,
        purchaseOrder: null,
        team_id: new TeamId("2bcaaafd-6b55-4a60-98ee-f78b352ee7d8"),
        budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
      },
      { created_by: "system", created_at: new Date() }
    );
    await repository.insert(entity);
    model = await ExpenseModel.findByPk(entity.id);
    foundEntity = ExpenseModelMapper.toEntity(model);

    expect(JSON.parse(JSON.stringify(foundEntity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(entity.toJSON()))
    );
  });

  it("should insert a new entity with invoices", async () => {
    let entity = new Expense(
      { ...entityProps, invoices },
      { created_by: "system" }
    );
    await createDependencies();
    await repository.insert(entity);
    let model = await ExpenseModel.findByPk(entity.id, {
      include: [InvoiceModel],
    });
    let foundEntity = ExpenseModelMapper.toEntity(model);

    expect(JSON.parse(JSON.stringify(foundEntity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(entity.toJSON()))
    );

    entity = new Expense(
      {
        name: "new entity",
        description: "some entity description",
        year: 2022,
        amount: 20.22,
        type: ExpenseType.OPEX,
        supplier_id: null,
        purchaseRequest: null,
        purchaseOrder: null,
        team_id: new TeamId("2bcaaafd-6b55-4a60-98ee-f78b352ee7d8"),
        budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
      },
      { created_by: "system", created_at: new Date() }
    );
    await repository.insert(entity);
    model = await ExpenseModel.findByPk(entity.id, { include: [InvoiceModel] });
    foundEntity = ExpenseModelMapper.toEntity(model);

    expect(JSON.parse(JSON.stringify(foundEntity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(entity.toJSON()))
    );
  });

  it("should find an entity", async () => {
    let entity = new Expense(
      { ...entityProps, invoices },
      { created_by: "system" }
    );
    await createDependencies();
    await repository.insert(entity);
    const foundEntity = await repository.findById(entity.id);
    expect(JSON.parse(JSON.stringify(foundEntity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(entity.toJSON()))
    );
  });

  it("should throw an error when entity has not been found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake id")
    );
    await expect(
      repository.findById("312cffad-1938-489e-a706-643dc9a3cfd3")
    ).rejects.toThrow(
      new NotFoundError(
        "Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3"
      )
    );
  });

  it("should find an entity by Id", async () => {
    const entity = new Expense(entityProps, { created_by: "system" });
    await createDependencies();
    await repository.insert(entity);
    let entityFound = await repository.findById(entity.id);

    expect(JSON.parse(JSON.stringify(entity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(entityFound.toJSON()))
    );

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(JSON.parse(JSON.stringify(entity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(entityFound.toJSON()))
    );
  });

  it("should return all entities", async () => {
    const entity = new Expense(entityProps, {
      created_by: "system",
      created_at: new Date(),
      updated_by: "system",
      updated_at: new Date(),
    });
    await createDependencies();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toStrictEqual(JSON.stringify([entity]));
  });

  it("should throw error on update when entity is not found", async () => {
    const entity = new Expense(entityProps, { created_by: "system" });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should update an entity", async () => {
    const entity = new Expense(entityProps, { created_by: "system" });
    await createDependencies();
    await repository.insert(entity);

    entity.updateInvoices(invoices, "user");
    await repository.update(entity);
    const foundEntity = await repository.findById(entity.id);

    expect(JSON.parse(JSON.stringify(entity.toJSON()))).toMatchObject(
      JSON.parse(JSON.stringify(foundEntity.toJSON()))
    );
  });

  it("should throw error on delete when entity is not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );

    await expect(
      repository.delete(
        new UniqueEntityId("e712d467-7625-437c-9803-9ba0c6b499b0")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID e712d467-7625-437c-9803-9ba0c6b499b0`
      )
    );
  });

  it("should delete an entity", async () => {
    const entity = new Expense(entityProps, { created_by: "system" });
    entity.updateInvoices(invoices, "user");
    await createDependencies();
    await repository.insert(entity);
    await repository.delete(entity.id);

    await expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );

    const foundEntity = await ExpenseModel.findByPk(entity.id);
    expect(foundEntity).toBeNull();
  });

  it("should not find an entity by name", async () => {
    expect(await repository.exists("fake name")).toBeFalsy();
  });

  it("should find an entity by name", async () => {
    const entity = new Expense(entityProps, { created_by: "system" });
    await createDependencies();
    await repository.insert(entity);
    expect(await repository.exists("some entity name")).toBeTruthy();
  });

  it("should return search result", async () => {
    const entity = new Expense(
      { ...entityProps, invoices },
      { created_by: "system" }
    );
    await createDependencies();
    await repository.insert(entity);
    const result = await repository.search(
      new ExpenseRepository.SearchParams({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "some",
      })
    );
    expect(result.items).toHaveLength(1);
  });

  describe("search method", () => {
    it("should only apply paginate when other params are null ", async () => {
      const created_at = new Date();
      await createDependencies();
      const models = await ExpenseModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: "some name",
          description: "some entity description",
          year: 2022,
          amount: 20.22,
          type: ExpenseType.OPEX,
          supplier_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
          purchaseRequest: "1234567890",
          purchaseOrder: "1234567890",
          team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
          budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
          created_by: "system",
          created_at: created_at,
          updated_by: "system",
          updated_at: created_at,
        }));

      const spyToEntity = jest.spyOn(ExpenseModelMapper, "toEntity");
      const selectedModels = models.slice(0, 15);
      const entities = selectedModels.map(
        (i) =>
          new Expense(
            {
              name: i.name,
              description: i.description,
              year: i.year,
              amount: i.amount,
              type: i.type,
              supplier_id: new SupplierId(i.supplier_id),
              purchaseRequest: i.purchaseRequest,
              purchaseOrder: i.purchaseOrder,
              team_id: new TeamId(i.team_id),
              budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
            },
            {
              created_by: "system",
              created_at: i.created_at,
              updated_by: "system",
              updated_at: i.created_at,
            },
            new UniqueEntityId(i.id)
          )
      );

      const result = await repository.search(
        new ExpenseRepository.SearchParams()
      );

      expect(result).toBeInstanceOf(ExpenseRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(result.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      result.items.forEach((item) => {
        expect(item).toBeInstanceOf(Expense);
        expect(item.id).toBeDefined();
        expect(item.toJSON()).toMatchObject({
          name: "some name",
          created_by: "system",
          created_at: created_at,
          updated_by: "system",
          updated_at: created_at,
        });
      });

      expect(JSON.stringify(result)).toStrictEqual(
        JSON.stringify(
          new ExpenseRepository.SearchResult({
            items: entities,
            total: 16,
            current_page: 1,
            per_page: 15,
            sort: null,
            sort_dir: null,
            filter: null,
          })
        )
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      await createDependencies();
      await ExpenseModel.factory()
        .count(16)
        .bulkCreate((index: number) => ({
          id: chance.guid({ version: 4 }),
          name: `Entity${index}`,
          description: "some entity description",
          year: 2022,
          amount: 20.22,
          type: ExpenseType.OPEX,
          supplier_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
          purchaseRequest: "1234567890",
          purchaseOrder: "1234567890",
          team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
          budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
          created_by: "system",
          created_at: new Date(created_at.getTime() + 100 * index),
          updated_by: "system",
          updated_at: new Date(created_at.getTime() + 100 * index),
        }));

      const searchOutputActual = await repository.search(
        new ExpenseRepository.SearchParams()
      );

      [...searchOutputActual.items].reverse().forEach((i, index) => {
        expect(i.name).toBe(`Entity${index + 1}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const defaultProps = {
        description: "some entity description",
        year: 2022,
        amount: 20.22,
        type: ExpenseType.OPEX,
        supplier_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
        purchaseRequest: "1234567890",
        purchaseOrder: "1234567890",
        team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
        budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
        created_by: "system",
        created_at: new Date(),
        updated_by: "system",
        updated_at: new Date(),
      };

      const entitiesProps = [
        { id: chance.guid({ version: 4 }), name: "test", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TeST", ...defaultProps },
      ];
      await createDependencies();
      const entities = await ExpenseModel.bulkCreate(entitiesProps);

      let searchOutputActual = await repository.search(
        new ExpenseRepository.SearchParams({
          filter: "TEST",
          page: 1,
          per_page: 2,
        })
      );

      let searchOutputExpected = new ExpenseRepository.SearchResult({
        items: [
          ExpenseModelMapper.toEntity(entities[0]),
          ExpenseModelMapper.toEntity(entities[2]),
        ],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      });

      expect(
        JSON.parse(JSON.stringify(searchOutputActual.toJSON()))
      ).toMatchObject(
        JSON.parse(JSON.stringify(searchOutputExpected.toJSON()))
      );

      searchOutputActual = await repository.search(
        new ExpenseRepository.SearchParams({
          filter: "TEST",
          page: 2,
          per_page: 2,
        })
      );

      searchOutputExpected = new ExpenseRepository.SearchResult({
        items: [ExpenseModelMapper.toEntity(entities[3])],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      });

      expect(
        JSON.parse(JSON.stringify(searchOutputActual.toJSON()))
      ).toMatchObject(
        JSON.parse(JSON.stringify(searchOutputExpected.toJSON()))
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);
      const defaultProps = {
        description: "some entity description",
        year: 2022,
        amount: 20.22,
        type: ExpenseType.OPEX,
        supplier_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
        purchaseRequest: "1234567890",
        purchaseOrder: "1234567890",
        team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
        budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
        created_by: "system",
        created_at: new Date(),
        updated_by: "system",
        updated_at: new Date(),
      };

      const entitiesProps = [
        { id: chance.guid({ version: 4 }), name: "b", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "d", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "e", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "c", ...defaultProps },
      ];

      await createDependencies();
      const models = await ExpenseModel.bulkCreate(entitiesProps);
      const items = models.map((model) => ExpenseModelMapper.toEntity(model));

      const arrange = [
        {
          params: new ExpenseRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new ExpenseRepository.SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new ExpenseRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new ExpenseRepository.SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new ExpenseRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new ExpenseRepository.SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: new ExpenseRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new ExpenseRepository.SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(JSON.parse(JSON.stringify(result.toJSON()))).toMatchObject(
          JSON.parse(JSON.stringify(i.result.toJSON()))
        );
      }
    });

    describe("should search using filter, sort and paginate", () => {
      beforeEach(async () => {
        await createDependencies();
      });
      const defaultProps = {
        description: "some entity description",
        year: 2022,
        amount: 20.22,
        type: ExpenseType.OPEX,
        supplier_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
        purchaseRequest: "1234567890",
        purchaseOrder: "1234567890",
        team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
        budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
        created_by: "system",
        created_at: new Date(),
        updated_by: "system",
        updated_at: new Date(),
      };

      const entitiesProps = [
        { id: chance.guid({ version: 4 }), name: "test", ...defaultProps }, // 0
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps }, // 1
        { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps }, // 2
        { id: chance.guid({ version: 4 }), name: "e", ...defaultProps }, // 3
        { id: chance.guid({ version: 4 }), name: "TeSt", ...defaultProps }, // 4
      ];

      beforeEach(async () => {
        await ExpenseModel.bulkCreate(entitiesProps);
      });

      const arrange = [
        {
          search_params: new ExpenseRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),

          search_result: new ExpenseRepository.SearchResult({
            items: [toEntity(entitiesProps[2]), toEntity(entitiesProps[4])],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          search_params: new ExpenseRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
          search_result: new ExpenseRepository.SearchResult({
            items: [toEntity(entitiesProps[0])],

            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
      ];

      function toEntity(entityProps: any): Expense {
        return new Expense(
          {
            name: entityProps.name,
            description: entityProps.description,
            year: entityProps.year,
            amount: entityProps.amount,
            type: entityProps.type,
            supplier_id: new SupplierId(entityProps.supplier_id),
            purchaseRequest: entityProps.purchaseRequest,
            purchaseOrder: entityProps.purchaseOrder,
            team_id: new TeamId(entityProps.team_id),
            budget_id: new BudgetId("ae21f4b3-ecac-4ad9-9496-d2da487c4044"),
          },
          {
            created_by: entityProps.created_by,
            created_at: entityProps.created_at,
            updated_by: entityProps.updated_by,
            updated_at: entityProps.updated_at,
          },
          new UniqueEntityId(entityProps.id)
        );
      }

      test.each(arrange)(
        "when search_params is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(JSON.parse(JSON.stringify(result.toJSON()))).toMatchObject(
            JSON.parse(JSON.stringify(search_result.toJSON()))
          );
        }
      );
    });
  });

  async function createDependencies(
    options: { supplier_id?: string; team_id?: string; budget_id?: string } = {
      supplier_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
      team_id: "2bcaaafd-6b55-4a60-98ee-f78b352ee7d8",
      budget_id: "ae21f4b3-ecac-4ad9-9496-d2da487c4044",
    }
  ) {
    const created_at = new Date();
    const created_by = "system";
    const updated_at = new Date();
    const updated_by = "system";
    const { supplier_id, team_id, budget_id } = options;
    const supplierName = "some supplier name";
    const teamName = "some team name";
    const budgetName = "some budget name";

    try {
      await SupplierModel.create({
        id: supplier_id,
        name: supplierName,
        created_at,
        created_by,
        updated_at,
        updated_by,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    try {
      await TeamModel.create({
        id: team_id,
        name: teamName,
        created_at,
        created_by,
        updated_at,
        updated_by,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    try {
      await BudgetModel.create({
        id: budget_id,
        name: budgetName,
        created_at,
        created_by,
        updated_at,
        updated_by,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
});
