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

  const normalizedPath = trimmedPath.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${backendUrl}/${normalizedPath}`;
};
