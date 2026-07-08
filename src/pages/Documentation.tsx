// src/pages/Documentation.tsx
import { motion } from 'framer-motion';
import { Code, Link, Zap, Shield } from 'lucide-react';

const Documentation = () => {
  const features = [
    {
      icon: Code,
      title: 'Easy Integration',
      description: 'Simple REST API with clear documentation for quick integration.',
    },
    {
      icon: Link,
      title: 'Flexible Output',
      description: 'Get data in JSON, HTML, or plain text format.',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Fast and reliable scraping with minimal latency.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and 99.9% uptime guarantee.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold gradient-text mb-6"
        >
          Documentation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 dark:text-gray-400 mb-12"
        >
          Learn how to use the Web Scraper API effectively.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <feature.icon className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            API Endpoint
          </h2>
          <div className="bg-gray-900/10 dark:bg-gray-900/30 rounded-xl p-4 mb-4">
            <code className="text-sm text-gray-800 dark:text-gray-200">
              GET https://api.lexcode.biz.id/api/tools/scrape-web?url={{URL}}
            </code>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Parameters
          </h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-4">
              <span className="font-mono text-sm text-indigo-500">url</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Required. The URL to scrape (must be URL-encoded)
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Documentation;
