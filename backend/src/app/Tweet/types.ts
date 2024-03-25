export const types = `
    input CreateTweetData{
        content: String!
        imgUrl: String 
    }

    input TweetId{
        id: ID!
    }
    
    type Tweet{
        id: ID!
        content: String!
        imageUrl: String
        author: User
        likes: Int
    }
`;
