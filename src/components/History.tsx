// src/components/History.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, ExternalLink, Calendar, X } from 'lucide-react';
import { HistoryItem } from '../types/scraper';
import ResultCard from './ResultCard';

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = JSON.parse(localStorage.getItem('scrapeHistory') || '[]');
    setHistory(data);
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem('scrapeHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const clearAll = () => {
    localStorage.removeItem('scrapeHistory');
    setHistory([]);
  };

  const filtered = history.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text">History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your scraping history
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl glass border border-white/20 dark:border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none"
          />
        </div>
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearAll}
            className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-all"
          >
            Clear All
          </motion.button>
        )}
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No history found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {search ? 'Try adjusting your search' : 'Start scraping to see results here'}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
              className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-500 hover:text-indigo-600 flex items-center space-x-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="truncate">{item.url}</span>
                    </a>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item)}
                    className="px-4 py-2 rounded-xl gradient-bg text-white font-medium text-sm hover:shadow-lg transition-all"
                  >
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteItem(item.id)}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <ResultCard result={selectedItem} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
