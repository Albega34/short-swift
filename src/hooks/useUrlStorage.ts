import { useState, useEffect } from 'react';
import { ShortenedUrl } from '@/types/url';

const STORAGE_KEY = 'shortened_urls';

export const useUrlStorage = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          expiresAt: new Date(url.expiresAt),
          isExpired: new Date() > new Date(url.expiresAt),
        }));
        setUrls(parsed);
      } catch (error) {
        console.error('Error parsing stored URLs:', error);
      }
    }
  }, []);

  const addUrl = (url: ShortenedUrl) => {
    const updatedUrls = [url, ...urls];
    setUrls(updatedUrls);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));
  };

  const generateShortCode = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isCodeExists = (code: string): boolean => {
    return urls.some(url => url.shortCode === code);
  };

  const getUrlByCode = (code: string): ShortenedUrl | undefined => {
    return urls.find(url => url.shortCode === code);
  };

  return {
    urls,
    addUrl,
    generateShortCode,
    isCodeExists,
    getUrlByCode,
  };
};