import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles($offset: Int = 0, $limit: Int = 10) {
    articles(offset: $offset, limit: $limit) {
      items {
        id
        title
        content
        createdAt
        imageUrl
      }
      totalCount
    }
  }
`;

export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      content
      createdAt
      imageUrl
    }
  }
`;
