export function formatDate(
  dateString: string,
  options?: { includeTime?: boolean },
): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(options?.includeTime && { hour: '2-digit', minute: '2-digit' }),
  });
}
