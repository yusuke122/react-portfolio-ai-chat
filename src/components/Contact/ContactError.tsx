import React from 'react';
import { motion } from 'framer-motion';
import './Contact.scss';

interface ContactErrorProps {
  onRetry: () => void;
  onReset: () => void;
}

export const ContactError: React.FC<ContactErrorProps> = ({ onRetry, onReset }) => {
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
          送信エラー
        </motion.h1>
        
        <motion.p 
          className="error-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          メール送信に失敗しました。
          <br />
          ネットワーク接続を確認して、再度お試しください。
        </motion.p>
        
        <motion.div 
          className="error-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button className="submit-button" onClick={onRetry}>
            再試行
          </button>
          <button className="submit-button secondary" onClick={onReset}>
            フォームをリセット
          </button>
        </motion.div>
      </div>
    </div>
  );
};