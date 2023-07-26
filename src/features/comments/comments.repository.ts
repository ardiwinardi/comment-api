
import { User } from '../auth/entities';
import { Comment, Reaction } from './shemas';

export interface CommentsRepository {
  findAll(): Promise<Comment[]>;
  findById(id: string): Promise<Comment>;
  create(item: Comment): Promise<Comment>;
  update(item: Comment): Promise<Comment>;
  remove(item: Comment): Promise<Comment>;
  addReaction(
    commentId: string,
    type: Reaction['type'],
    user: User
  ): Promise<Reaction>;
}
