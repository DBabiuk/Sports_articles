import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import { createApolloClient, getApolloClient } from '@/lib/apollo';
import { GET_ARTICLES } from '@/graphql/queries';
import { DELETE_ARTICLE } from '@/graphql/mutations';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import ErrorMessage from '@/components/ErrorMessage';
import { useState, useRef, useCallback, useTransition } from 'react';
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
  const [, startTransition] = useTransition();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const hasMore = articles.length < totalCount;

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const client = getApolloClient();
      const { data } = await client.query({
        query: GET_ARTICLES,
        variables: { offset: articles.length, limit: ARTICLES_PER_PAGE },
      });
      startTransition(() => {
        setArticles((prev) => [...prev, ...data.articles.items]);
        setTotalCount(data.articles.totalCount);
      });
    } catch {
      setErrorMessage('Failed to load more articles.');
    } finally {
      setLoadingMore(false);
    }
  };

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore || loadingMore) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleLoadMore();
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [hasMore, loadingMore, articles.length],
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      setErrorMessage(null);
      await deleteArticle({
        variables: { id },
        update(cache) {
          cache.evict({ id: cache.identify({ __typename: 'SportsArticle', id }) });
          cache.gc();
        },
      });
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
        <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
          {loadingMore && (
            <svg
              className="h-8 w-8 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
        </div>
      )}
    </Layout>
  );
}
