import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export class AddReactionDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ReactionType)
  @IsNotEmpty()
  type: ReactionType;
}
