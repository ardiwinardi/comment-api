import { NotFoundException } from "@src/shared/exceptions";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";

import { User } from "../auth/schemas";
import { CommentsRepository } from "./comments.repository";
import { Comment, Reaction } from "./shemas";

@injectable()
export class CommentsService implements CommentsRepository {
  constructor(@inject("COMMENT") private commentModel: Model<Comment>) {}

  findById(id: string): Promise<Comment> {
    return this.commentModel.findById(id).exec();
  }

  findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
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
  ): Promise<Reaction> {
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
    await item.save();

    return payload;
  }
}
