import { NotFoundException } from '@src/shared/exceptions';
import { Model } from 'mongoose';
import { inject, injectable } from 'tsyringe';

import { CommentsRepository } from './comments.repository';
import { AddReactionDTO, CreateCommentDTO, UpdateCommentDTO } from './dtos';
import { Comment, Reaction } from './shemas';

@injectable()
export class CommentsService implements CommentsRepository {
  constructor(@inject('COMMENT') private commentModel: Model<Comment>) {}

  findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  create(dto: CreateCommentDTO): Promise<Comment> {
    const createdComment = new this.commentModel({
      comment: dto.comment,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return createdComment.save();
  }

  async update(id: string, dto: UpdateCommentDTO): Promise<Comment> {
    const item = await this.commentModel.findByIdAndUpdate(id, {
      comment: dto.comment,
      updatedAt: new Date()
    });
    if (!item) throw new NotFoundException('comment not found');
    return item;
  }

  async remove(id: string): Promise<Comment> {
    const item = await this.commentModel.findByIdAndDelete(id);
    if (!item) throw new NotFoundException('comment not found');
    return item;
  }

  async addReaction(id: string, dto: AddReactionDTO): Promise<Reaction> {
    const payload: Reaction = {
      userId: dto.userId,
      type: dto.type,
      createdAt: new Date()
    };

    // checking is comment exists
    const item = await this.commentModel.findById(id);
    if (!item) throw new NotFoundException('comment not found');
    const reactions = [...item.reactions];

    // checking is reactions not empty
    if (reactions.length > 0) {
      // checking is user has given reaction
      const index = reactions.findIndex(
        (reaction) => reaction.userId === payload.userId
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
