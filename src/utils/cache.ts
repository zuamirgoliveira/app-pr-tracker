import { SearchType } from '../core/entities/search-type';

export interface CachedCredentials {
  organization: string;
  project?: string;
  token: string;
  searchType: SearchType;
}

const CACHE_KEY = 'azure-repos-credentials';

export const cacheUtils = {
  save: (credentials: CachedCredentials): void => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.warn('Failed to save credentials to cache:', error);
    }
  },

  load: (): CachedCredentials | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to load credentials from cache:', error);
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear credentials cache:', error);
    }
  },

  exists: (): boolean => {
    return localStorage.getItem(CACHE_KEY) !== null;
  }
};
