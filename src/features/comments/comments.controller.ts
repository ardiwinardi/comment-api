import formattedResponse from "@src/shared/commons/response";
import {
  RequestWithComment,
  RequestWithUser,
} from "@src/shared/interfaces/request";
import isAuthenticated from "@src/shared/middlewares/auth.middleware";
import isCommentAuthor from "@src/shared/middlewares/author.middleware";
import isValidId from "@src/shared/middlewares/object-id.middleware";
import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { injectable, registry } from "tsyringe";
import { CommentsService } from "./comments.service";
import { AddReactionDTO, CreateCommentDTO, UpdateCommentDTO } from "./dtos";
import commentModel, { Comment } from "./shemas/comment.schema";
@registry([
  {
    token: "COMMENT",
    useFactory: () => commentModel,
  },
])
@Tags("comments")
@Route("comments")
@Security("jwt")
@Middlewares(isAuthenticated)
@injectable()
export class CommentsController extends Controller {
  constructor(private readonly commentService: CommentsService) {
    super();
  }

  @Get()
  async getAll() {
    const data = await this.commentService.findAll();
    return formattedResponse({ data });
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
      reactions: [],
    };

    const data = await this.commentService.create(comment);
    return formattedResponse({ data, message: "comment created successfully" });
  }

  @Put("{id}")
  @Middlewares([isValidId, isCommentAuthor])
  async update(
    @Path() id: string,
    @Body() payload: UpdateCommentDTO,
    @Request() request: RequestWithComment
  ) {
    const comment: Comment = {
      ...request.comment,
      comment: payload.comment,
    };

    await this.commentService.update(comment);
    return formattedResponse({
      data: comment,
      message: "comment updated successfully",
    });
  }

  @Delete("{id}")
  @Middlewares([isValidId, isCommentAuthor])
  async delete(@Path() id: string, @Request() request: RequestWithComment) {
    const comment = request.comment;
    const data = await this.commentService.remove(comment);
    return formattedResponse({ data, message: "comment deleted successfully" });
  }

  @Post("{id}/react")
  @Middlewares(isValidId)
  async addReaction(
    @Path() id: string,
    @Body() payload: AddReactionDTO,
    @Request() request: RequestWithUser
  ) {
    await this.commentService.addReaction(id, payload.type, request.user);
    return formattedResponse({ message: "reaction created successfully" });
  }
}
