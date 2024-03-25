import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  mutation CreateTweet($payload: CreateTweetData!) {
    createTweet(payload: $payload) {
      id
      content
      imageUrl
      author {
        firstName
        id
        lastName
        ProfileImageUrl
      }
    }
  }
`);

export const likeTweetMutation = graphql(`
  mutation LikeTweet($payload: TweetId!) {
    likeTweet(payload: $payload) {
      id
      content
      imageUrl
      likes
      author {
        firstName
        lastName
        id
        ProfileImageUrl
        email
      }
    }
  }
`);
