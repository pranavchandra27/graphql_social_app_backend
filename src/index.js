import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";
import { MONGO_URI } from "@config";

import resolvers from "@resolvers";
import typeDefs from "@schemas";

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server
      .listen()
      .then(({ url }) => console.log(`🐱‍🏍Server is listening at ${url}`));
  })
  .catch((err) => console.log(err));
