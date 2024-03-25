import { graphql } from "../../gql";

export const getTweetsQuery = graphql(`
  query GetTweets {
    getAllTweets {
      id
      content
      likes
      imageUrl
      author {
        firstName
        lastName
        ProfileImageUrl
        id
      }
    }
  }
`);
