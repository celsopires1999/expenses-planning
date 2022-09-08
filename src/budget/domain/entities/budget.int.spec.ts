import { Budget, BudgetProps } from "#budget/domain/entities/budget";

describe("Budget Integration Tests", () => {
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
          () => new Budget({ name: i.name } as any, { created_by: "user" })
        ).containsErrorMessages(i.message);
      });
    });
  });
  describe("successfull operations", () => {
    describe("should create a supplier", () => {
      const arrange: BudgetProps[] = [{ name: "some name" }];

      test.each(arrange)("%#) when props are %o ", (i) => {
        const entity = new Budget(
          {
            name: i.name,
          },
          { created_by: "system" }
        );
        expect(entity.props).toMatchObject(i);
      });
    });
  });
});
