export enum CommentOrderBy {
  MOST_LIKED = "most-liked",
  MOST_DISLIKED = "most-disliked",
  NEWEST = "newest",
}

export interface GetCommentsDTO {
  orderBy?: CommentOrderBy;
  limit?: number;
  start?: number;
}
