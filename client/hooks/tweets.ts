import { graphqlClient } from "@/clients/api";
import { CreateTweetData, TweetId } from "@/gql/graphql";
import {
  createTweetMutation,
  likeTweetMutation,
} from "@/graphql/mutation/tweets";
import { getTweetsQuery } from "@/graphql/query/tweets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const getAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphqlClient.request(getTweetsQuery),
  });

  return { ...query, tweets: query.data?.getAllTweets };
};

export const createTweet = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphqlClient.request(createTweetMutation, { payload }),
    onMutate: () => toast.loading("Posting tweet"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tweets"] });
      toast.success("Tweet has been created successfully");
    },
  });

  return mutation;
};

export const likeTweet = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: TweetId) =>
      graphqlClient.request(likeTweetMutation, { payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tweets"] });
    },
  });

  return mutation;
};
