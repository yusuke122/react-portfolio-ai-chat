import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { useChatStore } from '../../hooks/useChat';
import './ChatMessage.scss';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    type?: 'text' | 'image_request' | 'image_response' | 'error';
    imageUrl?: string;
    imagePrompt?: string;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  const [isImageOpen, setIsImageOpen] = useState(false);

  // デバッグ用ログ
  console.log('ChatMessage rendered:', { 
    id: message.id, 
    type: message.type, 
    imageUrl: message.imageUrl,
    hasImage: !!message.imageUrl 
  });

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
      layout
    >
      <motion.div 
        className="message-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p>{message.text}</p>
        {message.imageUrl && (
          <div className="image-container">
            <Dialog.Root open={isImageOpen} onOpenChange={setIsImageOpen}>
              <Dialog.Trigger asChild>
                <motion.img 
                  src={message.imageUrl}
                  alt={message.imagePrompt || "Generated content"}
                  className="message-image"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onLoad={() => console.log('Image loaded:', message.imageUrl)}
                  onError={(e) => console.error('Image failed to load:', message.imageUrl, e)}
                />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="dialog-overlay-motion"
                />
                <Dialog.Content className="dialog-content">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="dialog-content-motion"
                  >
                    <motion.img 
                      src={message.imageUrl}
                      alt="Generated content"
                      className="img-fluid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                    <motion.button
                      className="close-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsImageOpen(false)}
                    >
                      <span>×</span>
                    </motion.button>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};