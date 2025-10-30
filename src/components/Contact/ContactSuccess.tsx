import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Contact.scss';

interface ContactSuccessProps {
  onReset: () => void;
}

export const ContactSuccess: React.FC<ContactSuccessProps> = ({ onReset }) => {
  const { t } = useTranslation();
  return (
    <div className="contact-grid">
      <div className="success-section">
        <motion.div 
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          ✅
        </motion.div>
        
        <motion.h1 
          className="success-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('pages.contact.success')}
        </motion.h1>
        
        <motion.p 
          className="success-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('pages.contact.successMessage')}
        </motion.p>
        
        <motion.button 
          className="submit-button" 
          onClick={onReset}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {t('pages.contact.backToForm')}
        </motion.button>
      </div>
    </div>
  );
};