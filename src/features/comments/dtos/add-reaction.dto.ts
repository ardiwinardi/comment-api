import { IsEnum, IsNotEmpty } from "class-validator";
import { ReactionType } from "../shemas";

export class AddReactionDTO {
  @IsEnum(ReactionType)
  @IsNotEmpty()
  type: ReactionType;
}
