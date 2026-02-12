const typeDefs = `#graphql
  type SportsArticle {
    id: ID!
    title: String!
    content: String!
    createdAt: String
    deletedAt: String
    imageUrl: String
  }

  input ArticleInput {
    title: String!
    content: String!
    imageUrl: String
  }

  type ArticlesResponse {
    items: [SportsArticle!]!
    totalCount: Int!
  }

  type Query {
    articles(offset: Int = 0, limit: Int = 10): ArticlesResponse!
    article(id: ID!): SportsArticle
  }

  type Mutation {
    createArticle(input: ArticleInput!): SportsArticle!
    updateArticle(id: ID!, input: ArticleInput!): SportsArticle!
    deleteArticle(id: ID!): Boolean!
  }
`;

export default typeDefs;
