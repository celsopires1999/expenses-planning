import { Expense, ExpenseProps } from "./expense";

describe("Expense Integration Tests", () => {
  describe("validations with errors", () => {
    describe("name prop", () => {
      const arrange = [
        {
          name: null as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: undefined as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "",
          message: {
            name: ["name should not be empty"],
          },
        },
        {
          name: 5,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: true,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: false,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "a".repeat(256),
          message: {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        },
      ];
      test.each(arrange)(`when name prop is "$name"`, (i) => {
        expect(
          () => new Expense({ name: i.name } as any)
        ).containsErrorMessages(i.message);
      });
    });
    describe("description prop", () => {
      const arrange = [
        {
          description: 5,
          message: {
            description: ["description must be a string"],
          },
        },
        {
          description: true,
          message: {
            description: ["description must be a string"],
          },
        },
      ];

      test.each(arrange)(`when description prop is "$description"`, (i) => {
        expect(
          () =>
            new Expense({
              name: "some name",
              description: i.description,
            } as any)
        ).containsErrorMessages(i.message);
      });
    });
  });
  describe("successfull operations", () => {
    describe("should create a category", () => {
      const arrange: ExpenseProps[] = [
        { name: "some name", description: "some description" },
        {
          name: "some name",
          description: "some description",
          created_at: new Date(),
        },
      ];

      test.each(arrange)("%#) when props are %o ", (i) => {
        const entity = new Expense({
          name: i.name,
          description: i.description,
          created_at: i.created_at,
        });
        expect(entity.props).toMatchObject(i);
        expect(entity.description).toBe(i.description);
        i.created_at === undefined
          ? expect(entity.created_at).toBeInstanceOf(Date)
          : expect(entity.created_at).toBe(i.created_at);
      });
    });
  });
});
