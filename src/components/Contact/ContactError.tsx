import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Contact.scss';

interface ContactErrorProps {
  onRetry: () => void;
  onReset: () => void;
}

export const ContactError: React.FC<ContactErrorProps> = ({ onRetry, onReset }) => {
  const { t } = useTranslation();
  return (
    <div className="contact-grid">
      <div className="error-section">
        <motion.div 
          className="error-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          ❌
        </motion.div>
        
        <motion.h1 
          className="error-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('pages.contact.error')}
        </motion.h1>
        
        <motion.p 
          className="error-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('pages.contact.errorMessage')}
        </motion.p>
        
        <motion.div 
          className="error-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button className="submit-button" onClick={onRetry}>
            {t('pages.contact.retry')}
          </button>
          <button className="submit-button secondary" onClick={onReset}>
            {t('pages.contact.backToForm')}
          </button>
        </motion.div>
      </div>
    </div>
  );
};