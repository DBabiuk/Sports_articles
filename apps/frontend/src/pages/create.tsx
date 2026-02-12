import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { CREATE_ARTICLE } from '@/graphql/mutations';
import Layout from '@/components/Layout';
import ArticleForm from '@/components/ArticleForm';
import ErrorMessage from '@/components/ErrorMessage';
import { useState } from 'react';

export default function CreateArticlePage() {
  const router = useRouter();
  const [createArticle, { loading }] = useMutation(CREATE_ARTICLE);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (data: { title: string; content: string; imageUrl: string }) => {
    try {
      setServerError(null);
      await createArticle({
        variables: {
          input: {
            title: data.title,
            content: data.content,
            imageUrl: data.imageUrl || null,
          },
        },
      });
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create article';
      setServerError(message);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Create Article — Sports Articles</title>
      </Head>

      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          &larr; Back to articles
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Create New Article</h1>
        {serverError && (
          <div className="mb-4">
            <ErrorMessage message={serverError} />
          </div>
        )}
        <ArticleForm onSubmit={handleSubmit} submitLabel="Create Article" loading={loading} />
      </div>
    </Layout>
  );
}
