import { RequestWithComment, RequestWithUser } from '@src/shared/interfaces/request';
import isAuthenticated from '@src/shared/middlewares/auth.middleware';
import isCommentAuthor from '@src/shared/middlewares/author.middleware';
import validObjectId from '@src/shared/middlewares/object-id.middleware';
import { Body, Controller, Delete, Get, Middlewares, Path, Post, Put, Request, Route, Security, Tags } from 'tsoa';
import { injectable, registry } from 'tsyringe';
import { CommentsService } from './comments.service';
import { AddReactionDTO, CreateCommentDTO, UpdateCommentDTO } from './dtos';
import commentModel, { Comment } from './shemas/comment.schema';


@registry([ 
  {
    token: 'COMMENT',
    useFactory: () => commentModel
  }
])

@Tags('comments')
@Route('comments')
@Middlewares(isAuthenticated)
@Security('jwt')
@injectable()
export class CommentsController extends Controller {
  constructor(private readonly commentService: CommentsService) {
    super();
  }

  @Get()
  getAll() {
    return this.commentService.findAll();
  }

  @Post()
  async create(
    @Body() payload: CreateCommentDTO,
    @Request() req: RequestWithUser
  ) {
    const { username, name } = req.user;
    const comment: Comment = {
      user: { username, name },
      comment: payload.comment,
      createdAt: new Date(),
      updatedAt: null,
      reactions: []
    };
    return this.commentService.create(comment);
  }

  @Put('{id}')
  @Middlewares(validObjectId)
  @Middlewares(isCommentAuthor)
  async update(
    @Path() id: string,
    @Body() payload: UpdateCommentDTO,
    @Request() request: RequestWithComment
  ) {
    const comment = {
      ...request.comment,
      comment: payload.comment
    };

    return this.commentService.update(comment);
  }

  @Delete('{id}')
  @Middlewares(validObjectId)
  @Middlewares(isCommentAuthor)
  async delete(@Path() id: string, @Request() request: RequestWithComment) {
    const comment = request.comment;
    return this.commentService.remove(comment);
  }

  @Post('{id}/react')
  @Middlewares(validObjectId)
  async addReaction(
    @Path() id: string,
    @Body() payload: AddReactionDTO,
    @Request() request: RequestWithUser
  ) {
    return this.commentService.addReaction(id, payload.type, request.user);
  }
}
