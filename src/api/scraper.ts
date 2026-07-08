import axios from 'axios';
import { ScrapeResult } from '../types/scraper';

const API_BASE = 'https://api.lexcode.biz.id/api/tools/scrape-web';

export const scrapeWebsite = async (url: string): Promise<ScrapeResult> => {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get(`${API_BASE}?url=${encodedUrl}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to scrape website');
    }

    const data = response.data.data;
    return {
      title: data.title || 'No Title',
      description: data.description || 'No Description',
      url: data.url || url,
      status: data.status || 200,
      metadata: data.metadata || {},
      htmlLength: data.htmlLength || 0,
      textContent: data.textContent || '',
      links: data.links || [],
      images: data.images || [],
      openGraph: data.openGraph || {},
      json: data,
      timestamp: Date.now(),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response) {
        throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
      }
      if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};
