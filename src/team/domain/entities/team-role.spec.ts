import { TeamRole, TeamRoleProps } from "./team-role";
import { validate as uuidValidate } from "uuid";
import { UniqueEntityId } from "../../../@seedwork/domain/entity/value-objects/unique-entity-id.vo";
import { AuditFields } from "../../../@seedwork/domain/entity/value-objects/audit-fields.vo";
import { Team } from "./team";


.
const testProps = {
  name: "initial name",
  team: new Team(), //*** how to cope with this challenge */
};

describe("TeamRole Unit Test", () => {
  beforeEach(() => {
    TeamRole.validate = jest.fn();
  });
  test("constructor with all props", () => {
    let props: TeamRoleProps = {
      ...testProps,
    };

    const auditFieldsProps = {
      created_by: "user",
      created_at: new Date(),
      updated_by: "new user",
      updated_at: new Date(),
    };

    let entity = new TeamRole(props, auditFieldsProps);

    expect(TeamRole.validate).toHaveBeenCalled();
    expect(entity.props).toStrictEqual(props);
    expect(entity.name).toBeTruthy();
    expect(entity.created_by).toBe(auditFieldsProps.created_by);
    expect(entity.created_at).toBe(auditFieldsProps.created_at);
    expect(entity.updated_by).toBe(auditFieldsProps.updated_by);
    expect(entity.updated_at).toBe(auditFieldsProps.updated_at);
  });

  test("constructor with mandatory props only", () => {
    const entity = new TeamRole(testProps, { created_by: "user" });

    expect(entity.name).toBe(testProps.name);
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(entity.props).toStrictEqual({
      name: testProps.name,
    });
    expect(entity.props).toMatchObject({
      name: testProps.name,
    });
  });

  test("getter and setter of name prop", () => {
    const entity = new TeamRole(testProps, { created_by: "user" });
    expect(entity.name).toBe(testProps.name);
    entity["name"] = "changed";
    expect(entity.name).toBe("changed");
  });

  test("getter and setter of auditFields prop", () => {
    const entity = new TeamRole(testProps, { created_by: "user" });
    expect(entity.created_at).toBeInstanceOf(Date);
    const now = new Date();
    const auditFields = new AuditFields({
      created_by: "user",
      created_at: now,
    });
    entity["auditFields"] = auditFields;
    expect(entity.created_at).toStrictEqual(now);
  });

  test("getter of created_by prop", () => {
    const entity = new TeamRole(testProps, { created_by: "system" });
    expect(entity.created_by).toBe("system");
  });

  test("getter of created_at prop", () => {
    const entity = new TeamRole(testProps, { created_by: "user" });
    expect(entity.created_at).toBeInstanceOf(Date);
  });

  test("getter of updated_by prop", () => {
    const entity = new TeamRole(testProps, {
      created_by: "user",
      updated_by: "system",
    });
    expect(entity.updated_by).toBe("system");
  });

  test("getter of updated_at prop", () => {
    const entity = new TeamRole(testProps, { created_by: "user" });
    expect(entity.updated_at).toBeInstanceOf(Date);
  });

  describe("id prop", () => {
    const arrange = [
      { id: new UniqueEntityId("") },
      { id: new UniqueEntityId(undefined) },
      { id: new UniqueEntityId(null) },
      { id: new UniqueEntityId("8105290d-2b16-499d-aa61-5c252cf5c7d6") },
    ];

    test.each(arrange)("%#) when props are %j", (item) => {
      const entity = new TeamRole(testProps, { created_by: "user" }, item.id);
      expect(entity.id).not.toBeNull();
      expect(uuidValidate(entity.id)).toBeTruthy();
    });
  });
});
