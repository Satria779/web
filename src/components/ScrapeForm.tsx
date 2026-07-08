import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useScraper } from '../hooks/useScraper';
import ResultCard from './ResultCard';

const ScrapeForm = () => {
  const [url, setUrl] = useState('');
  const { loading, progress, result, error, scrape } = useScraper();
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateUrl = (input: string): string | null => {
    if (!input.trim()) {
      return 'Please enter a URL';
    }
    
    let urlToCheck = input.trim();
    if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
      urlToCheck = 'https://' + urlToCheck;
    }
    
    try {
      new URL(urlToCheck);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateUrl(url);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError(null);
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    await scrape(finalUrl);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-3xl p-8 md:p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="https://example.com"
              className={`w-full px-6 py-4 pr-32 rounded-2xl bg-white/50 dark:bg-black/50 border ${
                validationError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
              } focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !url.trim()}
              className="absolute right-2 top-2 px-6 py-2 rounded-xl gradient-bg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scraping</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Scrape</span>
                </>
              )}
            </motion.button>
          </div>

          {validationError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{validationError}</span>
            </motion.p>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full gradient-bg rounded-full"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Scraping in progress... {Math.round(progress)}%
              </p>
            </motion.div>
          )}
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">Error</p>
                <p className="text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {result && <ResultCard result={result} />}
      </AnimatePresence>
    </div>
  );
};

export default ScrapeForm;
