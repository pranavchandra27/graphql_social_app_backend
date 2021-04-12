import userResolver from "@resolvers/user";
import postResolver from "@resolvers/post";
import commentReslover from "@resolvers/comments";

export default {
  Post: {
    likesCount: (parent) => parent.likes.length,
    commentsCount: (parent) => parent.comments.length,
  },
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...commentReslover.Mutation,
  },
  Subscription: {
    ...postResolver.Subscription,
  },
};
