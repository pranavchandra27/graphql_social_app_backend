import Post from "@models/Post";
import checkAuth from "@utils/checkAuth";
import { AuthenticationError, UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username: `${user.firstName} ${user.lastName}`,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIdx = post.comments.findIndex((c) => c.id === commentId);
        console.log(commentIdx);
        if (commentIdx >= 0) {
          if (
            post.comments[commentIdx].username ===
            `${user.firstName} ${user.lastName}`
          ) {
            post.comments.splice(commentIdx, 1);

            await post.save();

            return post;
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        } else {
          throw new UserInputError("Post not found");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
