import express from "express";
import bodyParser from "body-parser";
import cors = require("cors");
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { User } from "./user";
import JWTService from "../services/jwt";
import { Tweet } from "./Tweet";

export async function initServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  const graphqlServer = new ApolloServer<any>({
    typeDefs: `
        ${User.types}
        ${Tweet.types}
        type Query {
            ${User.queries}
            ${Tweet.queries}
        }
        type Mutation{
          ${Tweet.mutations.createTweetMutation}
          ${Tweet.mutations.likeMutation}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
      },
      ...Tweet.resolvers.userRelationResolverForTweet,
      ...User.resolvers.tweetsRelationForUser,
    },
  });

  await graphqlServer.start();
  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTService.decodeToken(
                req.headers.authorization.split("Bearer ")[1]
              )
            : undefined,
        };
      },
    })
  );

  return app;
}
