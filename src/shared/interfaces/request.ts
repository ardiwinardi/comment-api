import { User } from '@src/features/auth/entities';
import { Comment } from '@src/features/comments/shemas';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}


export interface RequestWithComment extends Request {
  comment: Comment
}
