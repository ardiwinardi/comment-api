import { IsEnum, IsNotEmpty } from 'class-validator';

enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export class AddReactionDTO {
  
  @IsEnum(ReactionType)
  @IsNotEmpty()
  type: ReactionType;
}
