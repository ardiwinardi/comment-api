import { User } from "../auth/schemas";
import { GetCommentsDTO } from "./dtos/get-comments.dto";
import { Comment, Reaction } from "./shemas";

export interface CommentsRepository {
  findAll(dto: GetCommentsDTO): Promise<Comment[]>;
  findById(id: string): Promise<Comment>;
  create(item: Comment): Promise<Comment>;
  update(item: Comment): Promise<Comment>;
  remove(item: Comment): Promise<Comment>;
  addReaction(
    commentId: string,
    type: Reaction["type"],
    user: User
  ): Promise<Comment>;
}
