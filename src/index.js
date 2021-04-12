import dotenv from "dotenv";
dotenv.config();
import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";

import resolvers from "@resolvers";
import typeDefs from "@schemas";

const pubsub = new PubSub();

const server = new ApolloServer({
  cors: {
    origin: "https://social-media-react-flax.vercel.app/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: "*",
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
