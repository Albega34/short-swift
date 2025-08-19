export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date;
  isExpired: boolean;
}

export interface UrlFormData {
  originalUrl: string;
  customCode?: string;
  validityMinutes: number;
}