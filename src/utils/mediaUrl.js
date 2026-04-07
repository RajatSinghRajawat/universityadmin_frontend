import { backendUrl } from '../services/api';

const ABSOLUTE_URL_REGEX = /^(https?:)?\/\//i;

export const getMediaUrl = (path) => {
  if (!path || typeof path !== 'string') return '';

  const trimmedPath = path.trim();
  if (!trimmedPath) return '';

  if (
    ABSOLUTE_URL_REGEX.test(trimmedPath) ||
    trimmedPath.startsWith('data:') ||
    trimmedPath.startsWith('blob:')
  ) {
    return trimmedPath;
  }

  let normalizedPath = trimmedPath.replace(/\\/g, '/').replace(/^\/+/, '');
  normalizedPath = normalizedPath.replace(/^public\//i, '');

  if (normalizedPath.toLowerCase().startsWith('uploads/')) {
    return `${backendUrl}/${normalizedPath}`;
  }

  // In many API responses image comes as only filename.
  const hasDirectory = normalizedPath.includes('/');
  if (!hasDirectory) {
    return `${backendUrl}/uploads/${normalizedPath}`;
  }

  return `${backendUrl}/${normalizedPath}`;
};
