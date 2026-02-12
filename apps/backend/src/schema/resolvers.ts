import { GraphQLError } from 'graphql';
import { IsNull } from 'typeorm';
import { AppDataSource } from '../data-source';
import { SportsArticle } from '../entity/SportsArticle';

const articleRepo = () => AppDataSource.getRepository(SportsArticle);

interface ArticleInput {
  title: string;
  content: string;
  imageUrl?: string | null;
}

function validateArticleInput(input: ArticleInput) {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!input.content || input.content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (errors.length > 0) {
    throw new GraphQLError(errors.join('. '), {
      extensions: { code: 'BAD_USER_INPUT', validationErrors: errors },
    });
  }
}

const resolvers = {
  SportsArticle: {
    createdAt: (parent: SportsArticle) => parent.createdAt?.toISOString() ?? null,
    deletedAt: (parent: SportsArticle) => parent.deletedAt?.toISOString() ?? null,
  },

  Query: {
    articles: async (
      _: unknown,
      { offset = 0, limit = 10 }: { offset?: number; limit?: number },
    ) => {
      const safeLimit = Math.min(Math.max(limit, 1), 50);
      const [items, totalCount] = await articleRepo().findAndCount({
        where: { deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: safeLimit,
      });
      return { items, totalCount };
    },

    article: async (_: unknown, { id }: { id: string }): Promise<SportsArticle | null> => {
      const article = await articleRepo().findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!article) {
        throw new GraphQLError(`Article with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return article;
    },
  },

  Mutation: {
    createArticle: async (_: unknown, { input }: { input: ArticleInput }): Promise<SportsArticle> => {
      validateArticleInput(input);

      const article = articleRepo().create({
        title: input.title.trim(),
        content: input.content.trim(),
        imageUrl: input.imageUrl || null,
      });

      return articleRepo().save(article);
    },

    updateArticle: async (_: unknown, { id, input }: { id: string; input: ArticleInput }): Promise<SportsArticle> => {
      validateArticleInput(input);

      const article = await articleRepo().findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!article) {
        throw new GraphQLError(`Article with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      article.title = input.title.trim();
      article.content = input.content.trim();
      article.imageUrl = input.imageUrl || null;

      return articleRepo().save(article);
    },

    deleteArticle: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      const article = await articleRepo().findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!article) {
        throw new GraphQLError(`Article with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await articleRepo().softRemove(article);
      return true;
    },
  },
};

export default resolvers;
