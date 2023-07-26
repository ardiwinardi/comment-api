import commentModel, { Comment } from '@src/features/comments/shemas/comment.schema';
import { NextFunction, Response } from 'express';
import { ForbidenException, HttpException, NotFoundException } from '../exceptions';
import { RequestWithUser } from '../interfaces/request';

const isCommentAuthor = async (
  req: RequestWithUser & {comment: Comment},
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const item = await commentModel.findById(id);
    if (!item) next(new NotFoundException('comment not found'));
    if (item.user.username !== user.username) next(new ForbidenException());
    req.comment = item

  } catch (error) {
    next(new HttpException(500, `Something went wrong ${error}`));
  }

  next();
};

export default isCommentAuthor;
