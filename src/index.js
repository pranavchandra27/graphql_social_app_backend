import dotenv from "dotenv";
import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";
import resolvers from "@resolvers";
import typeDefs from "@schemas";
dotenv.config();

const corsOptions = {
  origin: "*",
  credentials: true,
};

const pubsub = new PubSub();

const server = new ApolloServer({
  cors: corsOptions,
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server
      .listen({ port: process.env.PORT || 4000 })
      .then(({ url }) => console.log(`🐱‍🏍Server ready at ${url}`));
  })
  .catch((err) => console.log(err));
