import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
