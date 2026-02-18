import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatDate } from '@/utils/formatDate';

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  imageUrl?: string | null;
  onDelete: (id: string) => void;
}

export default function ArticleCard({
  id,
  title,
  content,
  createdAt,
  imageUrl,
  onDelete,
}: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const formattedDate = createdAt ? formatDate(createdAt) : null;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      {imageUrl && !imgError && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="p-5">
        <Link href={`/article/${id}`}>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {title}
          </h2>
        </Link>
        {formattedDate && (
          <p className="mb-2 text-sm text-gray-500">{formattedDate}</p>
        )}
        <p className="mb-4 text-gray-600 line-clamp-3">{content}</p>
        <div className="flex gap-3">
          <Link
            href={`/edit/${id}`}
            className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
