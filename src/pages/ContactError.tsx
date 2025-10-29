import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/custom.scss';

export const ContactError: React.FC = () => {
  return (
    <div className="contact-page">
      <motion.div 
        className="contact-card error-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="error-icon">✕</div>
        <h1 className="error-title">システムエラーです</h1>
        <p className="error-message">
          メール送信に失敗しました。<br />
          時間をおいて再度お試しください。
        </p>
        <div className="error-actions">
          <Link to="/contact" className="submit-button">
            戻る
          </Link>
          <Link to="/" className="submit-button secondary">
            ホームに戻る
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactError;
