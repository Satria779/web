// src/components/JsonViewer.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface JsonViewerProps {
  data: any;
}

const JsonViewer = ({ data }: JsonViewerProps) => {
  const [expanded, setExpanded] = useState(true);

  const renderValue = (value: any, key: string): React.ReactNode => {
    if (value === null) {
      return <span className="text-gray-400">null</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-purple-500">{String(value)}</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-500">{value}</span>;
    }
    
    if (typeof value === 'string') {
      if (value.length > 100) {
        return <span className="text-green-500">&quot;{value.substring(0, 100)}...&quot;</span>;
      }
      return <span className="text-green-500">&quot;{value}&quot;</span>;
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          <span className="text-gray-500">[{value.length} items]</span>
          <div className="mt-1 space-y-1">
            {value.slice(0, 5).map((item, i) => (
              <div key={i} className="text-sm">
                {typeof item === 'object' ? renderValue(item, `[${i}]`) : renderValue(item, `[${i}]`)}
              </div>
            ))}
            {value.length > 5 && (
              <span className="text-gray-400 text-sm">... and {value.length - 5} more</span>
            )}
          </div>
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      return (
        <div className="ml-4">
          <div className="space-y-1">
            {entries.map(([k, v]) => (
              <div key={k} className="text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">{k}: </span>
                {renderValue(v, k)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  return (
    <div className="rounded-xl bg-gray-900/5 dark:bg-gray-900/50 p-4 overflow-x-auto">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span>View JSON</span>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto"
          >
            <pre className="whitespace-pre-wrap">{renderValue(data, 'root')}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JsonViewer;
