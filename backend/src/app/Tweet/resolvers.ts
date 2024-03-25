import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients";
import { GraphqlContext } from "../interfaces";

interface CreateTweetPayload {
  content: string;
  imgUrl?: string;
}

interface TweetId {
  id: string;
}

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("User not authenticated");
    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageUrl: payload.imgUrl,

        author: { connect: { id: ctx.user.id } },
      },
    });

    return tweet;
  },

  likeTweet: async (
    parent: any,
    { payload }: { payload: TweetId },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("User not authenticated");
    const updatedTweet = await prismaClient.tweet.update({
      where: { id: payload.id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    return updatedTweet;
  },
};

const userRelationResolverForTweet = {
  Tweet: {
    author: (parent: Tweet) =>
      prismaClient.user.findUnique({ where: { id: parent.authorId } }),
  },
};

const queries = {
  getAllTweets: () =>
    prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
};

export const resolvers = { mutations, userRelationResolverForTweet, queries };
