import axios from "axios";
import { URL } from "url";
import { GeneratedTokenResponse } from "./types";
import { prismaClient } from "../../clients";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../interfaces";
import { User } from "@prisma/client";
const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const googleToken = token;
    const tokenGenerationUrl = new URL(
      "https://oauth2.googleapis.com/tokeninfo"
    );
    tokenGenerationUrl.searchParams.set("id_token", googleToken);

    const { data } = await axios.get<GeneratedTokenResponse>(
      tokenGenerationUrl.toString(),
      {
        responseType: "json",
      }
    );

    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          ProfileImageUrl: data.picture,
        },
      });
    }

    const userObj = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!userObj) throw new Error("User not found with associated email");

    const jwtToken = JWTService.generateToken(userObj);
    return jwtToken;
  },
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx.user?.id;
    if (!id) return null;

    const user = await prismaClient.user.findUnique({ where: { id } });
    return user;
  },
};

const tweetsRelationForUser = {
  User: {
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({ where: { authorId: parent.id } }),
  },
};

export const resolvers = { queries, tweetsRelationForUser };
