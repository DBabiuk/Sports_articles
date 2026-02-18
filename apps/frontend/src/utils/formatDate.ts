export function formatDate(
  dateString: string,
  options?: { includeTime?: boolean },
): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(options?.includeTime && { hour: '2-digit', minute: '2-digit' }),
    });
  } catch {
    return '';
  }
}
