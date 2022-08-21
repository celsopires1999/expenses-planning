import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { TeamMember } from "#team-member/domain/entities/team-member";
import { TeamMemberSequelize } from "#team-member/infra/db/sequelize/team-member-sequelize";
import { Team } from "#team/domain/entities/team";
import TeamMemberId from "#team/domain/entities/team-member-id.vo";
import { TeamRole } from "#team/domain/entities/team-role";
import { TeamRepository } from "#team/domain/repository/team-repository";
import { RoleName } from "#team/domain/validators/team-role.validator";
import { TeamSequelize } from "#team/infra/db/sequelize/team-sequelize";
import _chance from "chance";

const chance = _chance();

// const { TeamModelMapper } = TeamSequelize;
const { TeamModel, TeamRoleModel } = TeamSequelize;
const { TeamMemberModel } = TeamMemberSequelize;

describe("TeamSequelizeRepository Integration Tests", () => {
  setupSequelize({
    models: [TeamModel, TeamRoleModel, TeamMemberModel],
    logging: true,
  });

  let repository: TeamSequelize.TeamRepository;

  beforeEach(async () => {
    repository = new TeamSequelize.TeamRepository(TeamModel);
  });

  async function createTeamMember(): Promise<TeamMember> {
    const teamMemberRep = new TeamMemberSequelize.TeamMemberRepository(
      TeamMemberModel
    );

    const teamMember = new TeamMember(
      { name: "some name" },
      { created_by: "system" }
    );
    await teamMemberRep.insert(teamMember);
    return teamMember;
  }

  async function createTeam(options?: {
    teamName?: string;
    createdAt?: Date;
  }): Promise<Team> {
    const teamMember = await createTeamMember();
    const team_member_id = new TeamMemberId(teamMember.id);
    const roles = [
      new TeamRole(
        {
          name: RoleName.MANAGER,
          team_member_id,
        },
        { created_by: "user" }
      ),
      new TeamRole(
        {
          name: RoleName.ANALYST,
          team_member_id,
        },
        { created_by: "user" }
      ),
      new TeamRole(
        {
          name: RoleName.DEPUTY,
          team_member_id,
        },
        { created_by: "user" }
      ),
    ];
    const name = options?.teamName ? options.teamName : "new entity";
    const created_at = options?.createdAt ? options.createdAt : null;

    return new Team({ name, roles }, { created_by: "system", created_at });
  }

  it("should insert a new entity", async () => {
    const entity = await createTeam();
    await repository.insert(entity);

    const models = await TeamModel.findByPk(entity.id, {
      include: [TeamRoleModel],
    });

    const foundRoles = models.roles.map((role) => {
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
    const foundEntity = new Team(
      { name: models.name, roles: foundRoles },
      {
        created_by: models.created_by,
        created_at: models.created_at,
        updated_by: models.updated_by,
        updated_at: models.updated_at,
      },
      new UniqueEntityId(models.id)
    );
    expect(JSON.stringify(foundEntity)).toStrictEqual(JSON.stringify(entity));
  });

  it("should find an entity", async () => {
    const entity = await createTeam();
    await repository.insert(entity);
    const foundEntity = await repository.findById(entity.id);
    expect(JSON.stringify(foundEntity)).toStrictEqual(JSON.stringify(entity));
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
    const entity = await createTeam();
    await repository.insert(entity);

    let foundEntity = await repository.findById(entity.id);
    expect(JSON.stringify(foundEntity)).toStrictEqual(JSON.stringify(entity));

    foundEntity = await repository.findById(entity.uniqueEntityId);
    expect(JSON.stringify(foundEntity)).toStrictEqual(JSON.stringify(entity));
  });

  it("should return all entities", async () => {
    const entity = await createTeam();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toStrictEqual(JSON.stringify([entity]));
  });

  it("should throw error on update when entity is not found", async () => {
    const entity = await createTeam();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should update an entity", async () => {
    const entity = await createTeam();
    await repository.insert(entity);

    entity.change("updated team", entity.roles, "user");
    await repository.update(entity);
    const foundEntity = await repository.findById(entity.id);

    expect(entity.toJSON()).toStrictEqual(foundEntity.toJSON());
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
    const entity = await createTeam();
    await repository.insert(entity);
    await repository.delete(entity.id);

    await expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );

    const foundEntity = await TeamModel.findByPk(entity.id);
    expect(foundEntity).toBeNull();
  });

  it("should not find an entity by name", async () => {
    expect(await repository.exists("fake name")).toBeFalsy();
  });

  it("should find an entity by name", async () => {
    const entity = await createTeam();
    await repository.insert(entity);
    expect(await repository.exists("new entity")).toBeTruthy();
  });

  it("should return search result", async () => {
    const entity = await createTeam({ teamName: "some team" });
    await repository.insert(entity);
    const result = await repository.search(
      new TeamRepository.SearchParams({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "some",
      })
    );
    expect(result.items).toHaveLength(1);
  });

  // describe("search method", () => {
  //   it("should only apply paginate when other params are null ", async () => {
  //     const created_at = new Date();
  //     const models = await TeamModel.factory()
  //       .count(16)
  //       .bulkCreate(() => {
  //         const teamId = chance.guid({ version: 4 });
  //         const date = chance.date();
  //         return {
  //           id: chance.guid({ version: 4 }),
  //           name: "some name",
  //           created_by: "system",
  //           created_at: created_at,
  //           updated_by: "system",
  //           updated_at: created_at,
  //           roles: Object.values(RoleName).map((name) => {
  //             return {
  //               id: chance.guid({ version: 4 }),
  //               name,
  //               team_member_id: chance.guid({ version: 4 }),
  //               team_id: teamId,
  //               created_by: chance.word(),
  //               created_at: date,
  //               updated_by: chance.word(),
  //               updated_at: date,
  //             };
  //           }),
  //         };
  //       });

  //     const spyToEntity = jest.spyOn(TeamModelMapper, "toEntity");
  //     const selectedModels = models.slice(0, 15);
  //     const entities = selectedModels.map(
  //       (i) =>
  //         new Team(
  //           {
  //             name: i.name,
  //           },
  //           {
  //             created_by: "system",
  //             created_at: i.created_at,
  //             updated_by: "system",
  //             updated_at: i.created_at,
  //           },
  //           new UniqueEntityId(i.id)
  //         )
  //     );

  //     const result = await repository.search(new TeamRepository.SearchParams());

  //     expect(result).toBeInstanceOf(TeamRepository.SearchResult);
  //     expect(spyToEntity).toHaveBeenCalledTimes(15);
  //     expect(result.toJSON()).toMatchObject({
  //       total: 16,
  //       current_page: 1,
  //       last_page: 2,
  //       per_page: 15,
  //       sort: null,
  //       sort_dir: null,
  //       filter: null,
  //     });

  //     result.items.forEach((item) => {
  //       expect(item).toBeInstanceOf(Team);
  //       expect(item.id).toBeDefined();
  //       expect(item.toJSON()).toMatchObject({
  //         name: "some name",
  //         created_by: "system",
  //         created_at: created_at,
  //         updated_by: "system",
  //         updated_at: created_at,
  //       });
  //     });

  //     expect(JSON.stringify(result)).toStrictEqual(
  //       JSON.stringify(
  //         new TeamRepository.SearchResult({
  //           items: entities,
  //           total: 16,
  //           current_page: 1,
  //           per_page: 15,
  //           sort: null,
  //           sort_dir: null,
  //           filter: null,
  //         })
  //       )
  //     );
  //   });

  //   it("should order by created_at DESC when search params are null", async () => {
  //     const created_at = new Date();
  //     await TeamModel.factory()
  //       .count(16)
  //       .bulkCreate((index: number) => ({
  //         id: chance.guid({ version: 4 }),
  //         name: `Entity${index}`,
  //         created_by: "system",
  //         created_at: new Date(created_at.getTime() + 100 * index),
  //         updated_by: "system",
  //         updated_at: new Date(created_at.getTime() + 100 * index),
  //       }));

  //     const searchOutputActual = await repository.search(
  //       new TeamRepository.SearchParams()
  //     );

  //     [...searchOutputActual.items].reverse().forEach((i, index) => {
  //       expect(i.name).toBe(`Entity${index + 1}`);
  //     });
  //   });

  //   it("should apply paginate and filter", async () => {
  //     const defaultProps = {
  //       created_by: "system",
  //       created_at: new Date(),
  //       updated_by: "system",
  //       updated_at: new Date(),
  //     };

  //     const entitiesProps = [
  //       { id: chance.guid({ version: 4 }), name: "test", ...defaultProps },
  //       { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
  //       { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps },
  //       { id: chance.guid({ version: 4 }), name: "TeST", ...defaultProps },
  //     ];

  //     const entities = await TeamModel.bulkCreate(entitiesProps);

  //     let searchOutputActual = await repository.search(
  //       new TeamRepository.SearchParams({
  //         filter: "TEST",
  //         page: 1,
  //         per_page: 2,
  //       })
  //     );

  //     let searchOutputExpected = new TeamRepository.SearchResult({
  //       items: [
  //         TeamModelMapper.toEntity(entities[0]),
  //         TeamModelMapper.toEntity(entities[2]),
  //       ],
  //       total: 3,
  //       current_page: 1,
  //       per_page: 2,
  //       sort: null,
  //       sort_dir: null,
  //       filter: "TEST",
  //     });

  //     expect(searchOutputActual.toJSON()).toMatchObject(
  //       searchOutputExpected.toJSON()
  //     );

  //     searchOutputActual = await repository.search(
  //       new TeamRepository.SearchParams({
  //         filter: "TEST",
  //         page: 2,
  //         per_page: 2,
  //       })
  //     );

  //     searchOutputExpected = new TeamRepository.SearchResult({
  //       items: [TeamModelMapper.toEntity(entities[3])],
  //       total: 3,
  //       current_page: 2,
  //       per_page: 2,
  //       sort: null,
  //       sort_dir: null,
  //       filter: "TEST",
  //     });

  //     expect(searchOutputActual.toJSON()).toMatchObject(
  //       searchOutputExpected.toJSON()
  //     );
  //   });

  //   it("should apply paginate and sort", async () => {
  //     expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);
  //     const defaultProps = {
  //       created_by: "system",
  //       created_at: new Date(),
  //       updated_by: "system",
  //       updated_at: new Date(),
  //     };

  //     const entitiesProps = [
  //       { id: chance.guid({ version: 4 }), name: "b", ...defaultProps },
  //       { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
  //       { id: chance.guid({ version: 4 }), name: "d", ...defaultProps },
  //       { id: chance.guid({ version: 4 }), name: "e", ...defaultProps },
  //       { id: chance.guid({ version: 4 }), name: "c", ...defaultProps },
  //     ];

  //     const models = await TeamModel.bulkCreate(entitiesProps);
  //     const items = models.map((model) => TeamModelMapper.toEntity(model));

  //     const arrange = [
  //       {
  //         params: new TeamRepository.SearchParams({
  //           page: 1,
  //           per_page: 2,
  //           sort: "name",
  //         }),
  //         result: new TeamRepository.SearchResult({
  //           items: [items[1], items[0]],
  //           total: 5,
  //           current_page: 1,
  //           per_page: 2,
  //           sort: "name",
  //           sort_dir: "asc",
  //           filter: null,
  //         }),
  //       },
  //       {
  //         params: new TeamRepository.SearchParams({
  //           page: 2,
  //           per_page: 2,
  //           sort: "name",
  //         }),
  //         result: new TeamRepository.SearchResult({
  //           items: [items[4], items[2]],
  //           total: 5,
  //           current_page: 2,
  //           per_page: 2,
  //           sort: "name",
  //           sort_dir: "asc",
  //           filter: null,
  //         }),
  //       },
  //       {
  //         params: new TeamRepository.SearchParams({
  //           page: 1,
  //           per_page: 2,
  //           sort: "name",
  //           sort_dir: "desc",
  //         }),
  //         result: new TeamRepository.SearchResult({
  //           items: [items[3], items[2]],
  //           total: 5,
  //           current_page: 1,
  //           per_page: 2,
  //           sort: "name",
  //           sort_dir: "desc",
  //           filter: null,
  //         }),
  //       },
  //       {
  //         params: new TeamRepository.SearchParams({
  //           page: 2,
  //           per_page: 2,
  //           sort: "name",
  //           sort_dir: "desc",
  //         }),
  //         result: new TeamRepository.SearchResult({
  //           items: [items[4], items[0]],
  //           total: 5,
  //           current_page: 2,
  //           per_page: 2,
  //           sort: "name",
  //           sort_dir: "desc",
  //           filter: null,
  //         }),
  //       },
  //     ];

  //     for (const i of arrange) {
  //       let result = await repository.search(i.params);
  //       expect(result.toJSON()).toMatchObject(i.result.toJSON());
  //     }
  //   });

  //   // describe("should search using filter, sort and paginate", () => {
  //   //   const defaultProps = {
  //   //     created_by: "system",
  //   //     created_at: new Date(),
  //   //     updated_by: "system",
  //   //     updated_at: new Date(),
  //   //   };

  //   //   const entitiesProps = [
  //   //     { id: chance.guid({ version: 4 }), name: "test", ...defaultProps }, // 0
  //   //     { id: chance.guid({ version: 4 }), name: "a", ...defaultProps }, // 1
  //   //     { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps }, // 2
  //   //     { id: chance.guid({ version: 4 }), name: "e", ...defaultProps }, // 3
  //   //     { id: chance.guid({ version: 4 }), name: "TeSt", ...defaultProps }, // 4
  //   //   ];

  //   //   beforeEach(async () => {
  //   //     await TeamModel.bulkCreate(entitiesProps);
  //   //   });

  //   //   const arrange = [
  //   //     {
  //   //       search_params: new TeamRepository.SearchParams({
  //   //         page: 1,
  //   //         per_page: 2,
  //   //         sort: "name",
  //   //         sort_dir: "asc",
  //   //         filter: "TEST",
  //   //       }),

  //   //       search_result: new TeamRepository.SearchResult({
  //   //         items: [toEntity(entitiesProps[2]), toEntity(entitiesProps[4])],
  //   //         total: 3,
  //   //         current_page: 1,
  //   //         per_page: 2,
  //   //         sort: "name",
  //   //         sort_dir: "asc",
  //   //         filter: "TEST",
  //   //       }),
  //   //     },
  //   //     {
  //   //       search_params: new TeamRepository.SearchParams({
  //   //         page: 2,
  //   //         per_page: 2,
  //   //         sort: "name",
  //   //         sort_dir: "asc",
  //   //         filter: "TEST",
  //   //       }),
  //   //       search_result: new TeamRepository.SearchResult({
  //   //         items: [toEntity(entitiesProps[0])],

  //   //         total: 3,
  //   //         current_page: 2,
  //   //         per_page: 2,
  //   //         sort: "name",
  //   //         sort_dir: "asc",
  //   //         filter: "TEST",
  //   //       }),
  //   //     },
  //   //   ];

  //   //   function toEntity(entityProps: any): Team {
  //   //     return new Team(
  //   //       { name: entityProps.name },
  //   //       {
  //   //         created_by: entityProps.created_by,
  //   //         created_at: entityProps.created_at,
  //   //         updated_by: entityProps.updated_by,
  //   //         updated_at: entityProps.updated_at,
  //   //       },
  //   //       new UniqueEntityId(entityProps.id)
  //   //     );
  //   //   }

  //   //   test.each(arrange)(
  //   //     "when search_params is $search_params",
  //   //     async ({ search_params, search_result }) => {
  //   //       const result = await repository.search(search_params);
  //   //       expect(result.toJSON()).toMatchObject(search_result.toJSON());
  //   //     }
  //   //   );
  //   // });
  // });
});
