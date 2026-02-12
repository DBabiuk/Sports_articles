import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import { createApolloClient, getApolloClient } from '@/lib/apollo';
import { GET_ARTICLES } from '@/graphql/queries';
import { DELETE_ARTICLE } from '@/graphql/mutations';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import ErrorMessage from '@/components/ErrorMessage';
import { useState } from 'react';
import { SportsArticle } from '@/types/article';

const ARTICLES_PER_PAGE = 10;

interface PageProps {
  articles: SportsArticle[];
  totalCount: number;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const client = createApolloClient();
    const { data } = await client.query({
      query: GET_ARTICLES,
      variables: { offset: 0, limit: ARTICLES_PER_PAGE },
    });

    return {
      props: {
        articles: data.articles.items,
        totalCount: data.articles.totalCount,
      },
    };
  } catch {
    return {
      props: {
        articles: [],
        totalCount: 0,
        error: 'Failed to fetch articles. Make sure the backend is running.',
      },
    };
  }
};

export default function HomePage({
  articles: initialArticles,
  totalCount: initialTotalCount,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [articles, setArticles] = useState(initialArticles);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteArticle] = useMutation(DELETE_ARTICLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasMore = articles.length < totalCount;

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const client = getApolloClient();
      const { data } = await client.query({
        query: GET_ARTICLES,
        variables: { offset: articles.length, limit: ARTICLES_PER_PAGE },
      });
      setArticles((prev) => [...prev, ...data.articles.items]);
      setTotalCount(data.articles.totalCount);
    } catch {
      setErrorMessage('Failed to load more articles.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      setErrorMessage(null);
      await deleteArticle({ variables: { id } });
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete article';
      setErrorMessage(message);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Sports Articles</title>
        <meta name="description" content="Latest sports articles and news" />
      </Head>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Latest Articles</h1>
        <p className="mt-1 text-gray-500">Stay up to date with the latest sports news</p>
      </div>

      {error && <ErrorMessage message={error} />}
      {errorMessage && (
        <div className="mb-4">
          <ErrorMessage message={errorMessage} />
        </div>
      )}

      {articles.length === 0 && !error ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-md">
          <p className="text-gray-500 text-lg">No articles yet.</p>
          <p className="mt-2 text-gray-400">Create your first article to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              createdAt={article.createdAt}
              imageUrl={article.imageUrl}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </Layout>
  );
}
