import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactForm } from './ContactForm';
import { ContactSuccess } from './ContactSuccess';
import { ContactError } from './ContactError';

type ContactState = 'form' | 'success' | 'error';

export const Contact: React.FC = () => {
  const [state, setState] = useState<ContactState>('form');

  const handleSuccess = () => {
    setState('success');
  };

  const handleError = () => {
    setState('error');
  };

  const handleReset = () => {
    setState('form');
  };

  const handleRetry = () => {
    setState('form');
  };

  return (
    <motion.div 
      className="contact-page glass-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {state === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ContactForm onSuccess={handleSuccess} onError={handleError} />
          </motion.div>
        )}
        
        {state === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ContactSuccess onReset={handleReset} />
          </motion.div>
        )}
        
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ContactError onRetry={handleRetry} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};