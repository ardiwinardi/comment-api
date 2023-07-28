import { HttpException, NotFoundException } from "@src/shared/exceptions";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";

import { DataWithMeta } from "@src/shared/interfaces/response";
import { User } from "../auth/schemas";
import { CommentsRepository } from "./comments.repository";
import { CommentOrderBy, GetCommentsDTO } from "./dtos/get-comments.dto";
import { Comment, Reaction, ReactionType } from "./shemas";

@injectable()
export class CommentsService implements CommentsRepository {
  constructor(@inject("COMMENT") private commentModel: Model<Comment>) {}

  findById(id: string): Promise<Comment> {
    return this.commentModel.findById(id).exec();
  }

  async findAll({
    orderBy,
    limit = 3,
    start = 0,
  }: GetCommentsDTO): Promise<DataWithMeta<Comment[]>> {
    const query = this.commentModel.find();
    const totalRows = await this.commentModel.find().count();

    if (orderBy) {
      if (orderBy === CommentOrderBy.NEWEST) {
        query.sort({ updatedAt: -1 });
      } else if (orderBy === CommentOrderBy.MOST_DISLIKED) {
        query.sort({ totalDisliked: -1 });
      } else if (orderBy === CommentOrderBy.MOST_LIKED) {
        query.sort({ totalLiked: -1 });
      }
    }

    const data = await query.skip(start).limit(limit).exec();

    return {
      data,
      meta: {
        total: totalRows,
        limit,
        start,
      },
    };
  }

  create(comment: Comment): Promise<Comment> {
    const createdComment = new this.commentModel(comment);
    return createdComment.save();
  }

  async update({ id, comment }: Comment): Promise<Comment> {
    const item = await this.commentModel.findByIdAndUpdate(id, {
      comment: comment,
      updatedAt: new Date(),
    });
    if (!item) throw new NotFoundException("comment not found");
    return item;
  }

  async remove({ id }: Comment): Promise<Comment> {
    const item = await this.commentModel.findByIdAndDelete(id);
    if (!item) throw new NotFoundException("comment not found");
    return item;
  }

  async addReaction(
    commentId: string,
    type: Reaction["type"],
    user: User
  ): Promise<Comment> {
    const payload: Reaction = {
      username: user.username,
      type: type as Reaction["type"],
      createdAt: new Date(),
    };

    // checking is comment exists
    const item = await this.commentModel.findById(commentId);
    if (!item) throw new NotFoundException("comment not found");
    const reactions = [...item.reactions];

    // checking is reactions not empty
    if (reactions.length > 0) {
      // checking is user has given reaction
      const index = reactions.findIndex(
        (reaction) => reaction.username === payload.username
      );

      if (index >= 0) {
        if (reactions[index].updatedAt)
          throw new HttpException(403, "only allowed once");

        // validate if no changes
        if (reactions[index].type === payload.type) {
          return item;
        }
        // update reaction
        reactions[index].type = payload.type;
        reactions[index].updatedAt = new Date();
      } else {
        // add new reaction
        reactions.push(payload);
      }
    } else {
      // add new reaction to empty reaction list
      reactions.push(payload);
    }

    // store to db
    item.reactions = reactions;
    item.totalDisliked = reactions.filter(
      (reaction) => reaction.type === ReactionType.DISLIKE
    ).length;

    item.totalLiked = reactions.filter(
      (reaction) => reaction.type === ReactionType.LIKE
    ).length;

    await item.save();

    return item;
  }
}
