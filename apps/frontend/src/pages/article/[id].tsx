import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { createApolloClient } from '@/lib/apollo';
import { GET_ARTICLE } from '@/graphql/queries';
import { DELETE_ARTICLE } from '@/graphql/mutations';
import Layout from '@/components/Layout';
import ErrorMessage from '@/components/ErrorMessage';
import { useState } from 'react';
import { SportsArticle } from '@/types/article';
import { formatDate } from '@/utils/formatDate';

interface PageProps {
  article: SportsArticle | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const id = context.params?.id;
  if (!id || typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const client = createApolloClient();
    const { data } = await client.query({
      query: GET_ARTICLE,
      variables: { id },
    });

    if (!data.article) {
      return { notFound: true };
    }

    return {
      props: { article: data.article },
    };
  } catch {
    return {
      props: {
        article: null,
        error: 'Failed to fetch article.',
      },
    };
  }
};

export default function ArticleDetailPage({
  article,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [deleteArticle] = useMutation(DELETE_ARTICLE);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  if (error || !article) {
    return (
      <Layout>
        <ErrorMessage message={error || 'Article not found'} />
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to articles
        </Link>
      </Layout>
    );
  }

  const formattedDate = article.createdAt
    ? formatDate(article.createdAt, { includeTime: true })
    : null;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await deleteArticle({
        variables: { id: article.id },
        update(cache) {
          cache.evict({ id: cache.identify({ __typename: 'SportsArticle', id: article.id }) });
          cache.gc();
        },
        refetchQueries: ['GetArticles'],
      });
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete article';
      setDeleteError(message);
    }
  };

  return (
    <Layout>
      <Head>
        <title>{article.title} — Sports Articles</title>
        <meta name="description" content={article.content.slice(0, 160)} />
      </Head>

      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          &larr; Back to articles
        </Link>
      </div>

      <article className="overflow-hidden rounded-lg bg-white shadow-md">
        {article.imageUrl && !imgError && (
          <div className="relative h-64 w-full overflow-hidden sm:h-80">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, 80vw"
              className="object-cover"
              priority
              onError={() => setImgError(true)}
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
          {formattedDate && <p className="text-sm text-gray-500 mb-6">{formattedDate}</p>}
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>

          {deleteError && (
            <div className="mt-4">
              <ErrorMessage message={deleteError} />
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Link
              href={`/edit/${article.id}`}
              className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    </Layout>
  );
}
