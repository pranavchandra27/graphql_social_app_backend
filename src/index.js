import dotenv from "dotenv";
import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";

dotenv.config();

import resolvers from "@resolvers";
import typeDefs from "@schemas";

const pubsub = new PubSub();

const server = new ApolloServer({
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://social-media-react-flax.vercel.app"
        : "http://localhost:3000",
    credentials: true,
  },
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
