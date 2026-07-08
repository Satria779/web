// src/components/Footer.tsx
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-white/20 dark:border-white/5 py-8 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Web Scraper. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Version 1.0.0 • Powered by Unknown
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
