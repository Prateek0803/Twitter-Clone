export const types = `#graphql 
    type User{
        id: ID!
        firstName: String!
        lastName: String
        email: String!
        ProfileImageUrl: String

        tweets: [Tweet]
    }
`;

export interface GeneratedTokenResponse {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  nbf: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}
