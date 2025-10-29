import React from 'react';
import { motion } from 'framer-motion';
import './Contact.scss';

interface ContactSuccessProps {
  onReset: () => void;
}

export const ContactSuccess: React.FC<ContactSuccessProps> = ({ onReset }) => {
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
          送信完了
        </motion.h1>
        
        <motion.p 
          className="success-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          お問い合わせありがとうございます。
          <br />
          送信いただいた内容を確認し、追ってご連絡いたします。
        </motion.p>
        
        <motion.button 
          className="submit-button" 
          onClick={onReset}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          新しいお問い合わせ
        </motion.button>
      </div>
    </div>
  );
};