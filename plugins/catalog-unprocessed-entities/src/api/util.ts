export const isJsonContentType = (
  contentType: string | null | undefined,
): boolean => {
  if (!contentType) {
    return false;
  }

  const mediaType = contentType.split(';')[0].trim().toLowerCase();

  return mediaType === 'application/json' || mediaType.endsWith('+json');
};
