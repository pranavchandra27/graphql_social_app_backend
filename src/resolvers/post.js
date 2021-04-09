import Post from "@models/Post";
import checkAuth from "@utils/checkAuth";
import { AuthenticationError, UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.firstName + " " + user.lastName,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", { newPost: post });

      return post;
    },

    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.id === post.user.toString()) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    likePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        if (
          post.likes.find(
            (like) => like.username === `${user.firstName} ${user.lastName}`
          )
        ) {
          // Post already liked
          post.likes = post.likes.filter(
            (like) => like.username !== `${user.firstName} ${user.lastName}`
          );
          await post.save();
        } else {
          /// Not liked
          post.likes.push({
            username: `${user.firstName} ${user.lastName}`,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
