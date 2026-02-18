import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { createApolloClient } from '@/lib/apollo';
import { GET_ARTICLE } from '@/graphql/queries';
import { UPDATE_ARTICLE } from '@/graphql/mutations';
import Layout from '@/components/Layout';
import ArticleForm from '@/components/ArticleForm';
import ErrorMessage from '@/components/ErrorMessage';
import { useState } from 'react';
import { SportsArticle } from '@/types/article';

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

export default function EditArticlePage({
  article,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [updateArticle, { loading }] = useMutation(UPDATE_ARTICLE);
  const [serverError, setServerError] = useState<string | null>(null);

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

  const handleSubmit = async (data: { title: string; content: string; imageUrl: string }) => {
    try {
      setServerError(null);
      await updateArticle({
        variables: {
          id: article.id,
          input: {
            title: data.title,
            content: data.content,
            imageUrl: data.imageUrl || null,
          },
        },
        refetchQueries: ['GetArticles'],
      });
      router.push(`/article/${article.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update article';
      setServerError(message);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Edit Article — Sports Articles</title>
      </Head>

      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          &larr; Back to articles
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Article</h1>
        {serverError && (
          <div className="mb-4">
            <ErrorMessage message={serverError} />
          </div>
        )}
        <ArticleForm
          initialTitle={article.title}
          initialContent={article.content}
          initialImageUrl={article.imageUrl || ''}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loading={loading}
        />
      </div>
    </Layout>
  );
}
