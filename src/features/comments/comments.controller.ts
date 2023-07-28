import formattedResponse from "@src/shared/commons/fotmat-response";
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
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { injectable, registry } from "tsyringe";
import { CommentsService } from "./comments.service";
import { AddReactionDTO, CreateCommentDTO, UpdateCommentDTO } from "./dtos";
import { CommentOrderBy } from "./dtos/get-comments.dto";
import commentModel, { Comment } from "./shemas/comment.schema";
@registry([
  {
    token: "COMMENT",
    useFactory: () => commentModel,
  },
])
@Tags("comments")
@Route("comments")
@injectable()
export class CommentsController extends Controller {
  constructor(private readonly commentService: CommentsService) {
    super();
  }

  @Get()
  async getAll(
    @Query("orderBy") orderBy?: CommentOrderBy,
    @Query("limit") limit?: number,
    @Query("start") start?: number
  ) {
    const comments = await this.commentService.findAll({
      orderBy,
      limit,
      start,
    });
    return formattedResponse({ data: comments.data, meta: comments.meta });
  }

  @Get("/{id}")
  @Security("jwt")
  @Middlewares([isValidId, isAuthenticated])
  async getById(@Path() id: string) {
    const data = await this.commentService.findById(id);
    return formattedResponse({ data });
  }

  @Post()
  @Security("jwt")
  @Middlewares([isAuthenticated])
  async create(
    @Body() payload: CreateCommentDTO,
    @Request() req: RequestWithUser
  ) {
    const { username, name } = req.user;

    const createdAt = new Date();
    const comment: Comment = {
      user: { username, name },
      comment: payload.comment,
      createdAt: createdAt,
      updatedAt: createdAt,
      totalLiked: 0,
      totalDisliked: 0,
      reactions: [],
    };

    const data = await this.commentService.create(comment);
    return formattedResponse({ data, message: "comment created successfully" });
  }

  @Put("{id}")
  @Middlewares([isValidId, isAuthenticated, isCommentAuthor])
  async update(
    @Path() id: string,
    @Body() payload: UpdateCommentDTO,
    @Request() request: RequestWithComment
  ) {
    const data = request.comment;
    data.comment = payload.comment;

    await this.commentService.update(data);
    return formattedResponse({
      data,
      message: "comment updated successfully",
    });
  }

  @Delete("{id}")
  @Security("jwt")
  @Middlewares([isValidId, isAuthenticated, isCommentAuthor])
  async delete(@Path() id: string, @Request() request: RequestWithComment) {
    const comment = request.comment;
    const data = await this.commentService.remove(comment);
    return formattedResponse({ data, message: "comment deleted successfully" });
  }

  @Post("{id}/react")
  @Middlewares([isValidId, isAuthenticated])
  async addReaction(
    @Path() id: string,
    @Body() payload: AddReactionDTO,
    @Request() request: RequestWithUser
  ) {
    const data = await this.commentService.addReaction(
      id,
      payload.type,
      request.user
    );
    return formattedResponse({
      data,
      message: "reaction created successfully",
    });
  }
}
