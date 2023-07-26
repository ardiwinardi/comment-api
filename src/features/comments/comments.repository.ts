import { AddReactionDTO, CreateCommentDTO, UpdateCommentDTO } from './dtos';
import { Comment, Reaction } from './shemas';

export interface CommentsRepository {
  findAll(): Promise<Comment[]>;
  create(dto: CreateCommentDTO): Promise<Comment>;
  update(id: string, dto: UpdateCommentDTO): Promise<Comment>;
  remove(id: string): Promise<Comment>;
  addReaction(id: string, dto: AddReactionDTO): Promise<Reaction>;
}
