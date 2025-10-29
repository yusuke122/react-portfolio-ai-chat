import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/custom.scss';

export const ContactSuccess: React.FC = () => {
  return (
    <div className="contact-page">
      <motion.div 
        className="contact-card success-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="success-icon">✓</div>
        <h1 className="success-title">送信が完了しました</h1>
        <p className="success-message">
          メールをご確認ください。<br />
          お問い合わせいただきありがとうございます。
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="submit-button">
            ホームに戻る
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSuccess;
