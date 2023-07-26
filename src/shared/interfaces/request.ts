import { User } from '@src/features/auth/entities';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
