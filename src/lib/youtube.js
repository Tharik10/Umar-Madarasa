export function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) return match[1];
  }
  return null;
}

export function isValidYouTubeUrl(url) {
  return Boolean(extractYouTubeVideoId(url));
}

export function getYouTubeEmbedUrl(url) {
  const id = extractYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

export function getYouTubeThumbnailUrl(url) {
  const id = extractYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
