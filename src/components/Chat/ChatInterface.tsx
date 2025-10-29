import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useChatStore } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import './ChatInterface.scss';

export const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const { messages, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      await sendMessage(input);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="chat-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="messages-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
      </motion.div>
      <motion.form 
        onSubmit={handleSubmit} 
        className="chat-input-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="input-group">
          <motion.input
            type="text"
            placeholder={t('pages.chat.placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <motion.span
                className="spinner-border spinner-border-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : null}
            {t('pages.chat.send')}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};