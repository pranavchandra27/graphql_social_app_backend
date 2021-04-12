import dotenv from "dotenv";
import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

import resolvers from "@resolvers";
import typeDefs from "@schemas";

const pubsub = new PubSub();

const server = new ApolloServer({
  cors: cors(),
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
      .listen()
      .then(({ url }) => console.log(`🐱‍🏍Server is listening at ${url}`));
  })
  .catch((err) => console.log(err));
