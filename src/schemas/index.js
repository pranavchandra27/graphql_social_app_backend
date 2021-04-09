import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    token: String!
  }

  type Post {
    id: ID!
    user: String!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type Query {
    getPosts: [Post]!
    getUser(token: String!): User!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;

export default typeDefs;
