// src/hooks/useScraper.ts
import { useState } from 'react';
import { scrapeWebsite } from '../api/scraper';
import { ScrapeResult } from '../types/scraper';

export const useScraper = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrape = async (url: string) => {
    setLoading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 200);

    try {
      const data = await scrapeWebsite(url);
      setResult(data);
      setProgress(100);
      
      // Save to history
      const history = JSON.parse(localStorage.getItem('scrapeHistory') || '[]');
      const newHistory = [{ id: Date.now().toString(), ...data }, ...history];
      localStorage.setItem('scrapeHistory', JSON.stringify(newHistory.slice(0, 50)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return { loading, progress, result, error, scrape };
};
