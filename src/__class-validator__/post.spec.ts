import { validateSync } from "class-validator";
import { TeamMemberId } from "./../team/domain/entities/team-member-id.vo";
import { TeamRole } from "./../team/domain/entities/team-role";
import { RoleName } from "./../team/domain/validators/team-role.validator";
import { Post } from "./post";

describe("Post Tests", () => {
  test("with roles", () => {
    const roles = [
      new TeamRole(
        {
          name: RoleName.ANALYST,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" }
      ),
      new TeamRole(
        {
          name: RoleName.DEPUTY,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" }
      ),
      new TeamRole(
        {
          name: RoleName.MANAGER,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" }
      ),
    ];
    const post = new Post();
    post.title = "this is the title";
    post.text = "this is the text that has to be greater than the title";
    post.roles = roles;
    post.created_at = null;
    const errors = validateSync(post);
    console.log(errors);
    expect(errors.length).toBe(0);
  });
  test("without roles", () => {
    const post = new Post();
    post.title = "this is the title";
    post.text = "this is the text that has to be greater than the title";
    const errors = validateSync(post);
    console.log(errors);
    expect(errors.length).toBe(1);
  });
  test("without roles", () => {
    const post = new Post();
    post.title = "this is the title";
    post.text = "this is the text that has to be greater than the title";
    post.roles = "nome" as any;
    const errors = validateSync(post);
    console.log(errors);
    expect(errors.length).toBe(1);
  });

  test("with roles & Dates", () => {
    const roles = [
      new TeamRole(
        {
          name: RoleName.ANALYST,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" }
      ),
      new TeamRole(
        {
          name: RoleName.DEPUTY,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" }
      ),
      new TeamRole(
        {
          name: RoleName.MANAGER,
          team_member_id: new TeamMemberId(
            "25a68560-05cb-4608-91b3-0c9e9daf0bb9"
          ),
        },
        { created_by: "user" }
      ),
    ];
    const post = new Post();
    post.title = "this is the title";
    post.text = "this is the text that has to be greater than the title";
    post.roles = roles;
    post.created_at = new Date();
    post.updated_at = new Date(post.created_at.getTime() + 1);
    const errors = validateSync(post);
    console.log(errors);
    expect(errors.length).toBe(0);
  });
});
