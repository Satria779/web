// src/types/scraper.ts
export interface ScrapeResult {
  title: string;
  description: string;
  url: string;
  status: number;
  metadata: Record<string, any>;
  htmlLength: number;
  textContent: string;
  links: string[];
  images: string[];
  openGraph: Record<string, any>;
  json: any;
  timestamp: number;
}

export interface HistoryItem extends ScrapeResult {
  id: string;
}

export interface ScrapeRequest {
  url: string;
}
