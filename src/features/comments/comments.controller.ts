import { validateId } from '@src/shared/commons/validate';
import authMiddleware from '@src/shared/middlewares/auth.middleware';
import { Body, Controller, Delete, Get, Middlewares, Path, Post, Put, Route, Security, Tags } from 'tsoa';
import { injectable, registry } from 'tsyringe';
import { CommentsService } from './comments.service';
import { AddReactionDTO, CreateCommentDTO, UpdateCommentDTO } from './dtos';
import commentModel from './shemas/comment.schema';

@registry([
  {
    token: 'COMMENT',
    useFactory: () => commentModel
  }
])
@Tags('comments')
@Route('comments')
@Middlewares(authMiddleware)
@injectable()
export class CommentsController extends Controller {
  constructor(private readonly commentService: CommentsService) {
    super();
  }

  @Get()
  @Security('jwt')
  getAll() {
    return this.commentService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateCommentDTO) {
    return this.commentService.create(payload);
  }

  @Put('{id}')
  async update(@Path() id: string, @Body() payload: UpdateCommentDTO) {
    validateId(id);
    return this.commentService.update(id, payload);
  }

  @Delete('{id}')
  async delete(@Path() id: string) {
    validateId(id);
    return this.commentService.remove(id);
  }

  @Post('{id}/react')
  async addReaction(@Path() id: string, @Body() payload: AddReactionDTO) {
    validateId(id);
    return this.commentService.addReaction(id, payload);
  }
}
