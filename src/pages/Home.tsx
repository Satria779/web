// src/pages/Home.tsx
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ScrapeForm from '../components/ScrapeForm';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <ScrapeForm />
    </motion.div>
  );
};

export default Home;
