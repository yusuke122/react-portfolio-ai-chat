import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      className="container py-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="display-4 mb-4"
        variants={itemVariants}
      >
        {t('pages.home.title')}
      </motion.h1>
      
      <motion.p
        className="lead mb-4"
        variants={itemVariants}
      >
        {t('pages.home.description')}
      </motion.p>

      <motion.div
        className="features-grid"
        variants={itemVariants}
      >
        {/* Feature cards will be added here */}
      </motion.div>
    </motion.div>
  );
};

export default Home;