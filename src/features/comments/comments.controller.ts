import { validateId } from '@src/shared/commons/validate';
import { Body, Controller, Delete, Get, Path, Post, Put, Route } from 'tsoa';
import { injectable, registry } from 'tsyringe';
import { CommentsService } from './comments.service';
import { AddReactionDTO, CreateCommentDTO, UpdateCommentDTO } from './dto';
import commentModel from './shemas/comment.schema';

@registry([
  {
    token: 'COMMENT',
    useFactory: () => commentModel
  }
])
@Route('comments')
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
