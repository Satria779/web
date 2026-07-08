import { motion } from 'framer-motion';
import { Copy, ExternalLink, FileJson, FileText, Code, Check, Link2, Image } from 'lucide-react';
import { useState } from 'react';
import { ScrapeResult } from '../types/scraper';
import { copyToClipboard } from '../utils/clipboard';
import { downloadFile } from '../utils/download';
import JsonViewer from './JsonViewer';

interface ResultCardProps {
  result: ScrapeResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleDownload = (content: string, filename: string, type: string) => {
    try {
      downloadFile(content, filename, type);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getJsonString = () => {
    try {
      return JSON.stringify(result.json, null, 2);
    } catch {
      return JSON.stringify(result, null, 2);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-8"
    >
      <div className="glass-card rounded-3xl p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-600 flex items-center space-x-1 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="truncate max-w-xs">{result.url}</span>
              </a>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                result.status === 200
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                Status: {result.status}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Copy, label: 'Copy HTML', action: () => handleCopy(result.textContent, 'html'), type: 'html' },
              { icon: FileText, label: 'Copy Text', action: () => handleCopy(result.textContent, 'text'), type: 'text' },
              { icon: FileJson, label: 'Copy JSON', action: () => handleCopy(getJsonString(), 'json'), type: 'json' },
            ].map(({ icon: Icon, label, action, type }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all text-sm"
              >
                {copied === type ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span>{copied === type ? 'Copied!' : label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {result.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">{result.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Code className="w-4 h-4" />
              <span>HTML Length</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {result.htmlLength.toLocaleString()} chars
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Link2 className="w-4 h-4" />
              <span>Links Found</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {result.links.length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {result.images.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span>Images ({result.images.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.images.slice(0, 10).map((img, i) => (
                  <img key={i} src={img} alt={`Image ${i + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                ))}
                {result.images.length > 10 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
                    +{result.images.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}

          {result.links.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Extracted Links ({result.links.length})
              </h3>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {result.links.slice(0, 20).map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-indigo-500 hover:text-indigo-600 truncate"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {Object.keys(result.openGraph).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Open Graph
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(result.openGraph).map(([key, value]) => (
                  <div key={key} className="p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{key}</span>
                    <p className="text-sm text-gray-900 dark:text-white truncate">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              JSON Response
            </h3>
            <JsonViewer data={result.json} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {[
            { 
              label: 'Download JSON', 
              action: () => handleDownload(getJsonString(), 'scrape-result.json', 'application/json'), 
              icon: FileJson 
            },
            { 
              label: 'Download TXT', 
              action: () => handleDownload(result.textContent, 'scrape-result.txt', 'text/plain'), 
              icon: FileText 
            },
            { 
              label: 'Download HTML', 
              action: () => handleDownload(result.textContent, 'scrape-result.html', 'text/html'), 
              icon: Code 
            },
          ].map(({ label, action, icon: Icon }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl gradient-bg text-white font-medium hover:shadow-lg transition-all"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
