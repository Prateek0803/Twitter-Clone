export const createTweetMutation = `
    createTweet(payload: CreateTweetData!): Tweet
`;

export const likeMutation = `
    likeTweet(payload: TweetId!): Tweet
`;

export const mutations = { createTweetMutation, likeMutation };
