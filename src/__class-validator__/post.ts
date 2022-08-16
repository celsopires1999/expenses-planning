import {
  IsDate,
  IsEmpty,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";
import { TeamRole } from "./../team/domain/entities/team-role";
import { IsLongerThan, HasRoles, IsNotOlderThan } from "./custom-decorator";

export class Post {
  @MinLength(3)
  title: string;

  @MinLength(10)
  @IsLongerThan("title", {
    message: "Text must be longer than the title",
  })
  text: string;

  @IsNotEmpty()
  @IsInstance(TeamRole, { each: true })
  @HasRoles({
    message: "Roles are required",
  })
  roles: TeamRole[];

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsNotOlderThan("created_at", {
    message: "updated_at must be older than created_at",
  })
  @IsDate()
  updated_at?: Date;
}
