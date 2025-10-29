import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useChatStore } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { Avatar } from '../Character/Avatar';
import { InteractiveCanvas } from '../Interactive/InteractiveCanvas';
import './ChatInterface.scss';

export const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarMood, setAvatarMood] = useState<'idle' | 'thinking' | 'talking' | 'happy'>('idle');

  const simulateAIResponse = async (text: string) => {
    setAvatarMood('thinking');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = [
      "そうですね、その考えは興味深いですね。もう少し詳しく教えていただけますか？",
      "なるほど、確かにその視点は重要ですね。私からは以下の提案もさせていただきたいと思います...",
      "その考えについて、別の角度からも見てみましょう。例えば...",
      "ご指摘ありがとうございます。その点については、さらに掘り下げて考えてみる必要がありそうですね。",
      "とても良い質問ですね。これについて、以下のような観点から考えてみましょう..."
    ];
    
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      setAvatarMood('happy');
      return "こんにちは！お手伝いできることはありますか？";
    }
    
    if (text.includes('?') || text.includes('？')) {
      setAvatarMood('talking');
      return "良い質問ですね。" + responses[Math.floor(Math.random() * 3)];
    }
    
    setAvatarMood('talking');
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleAvatarClick = () => {
    setAvatarMood('happy');
    setTimeout(() => setAvatarMood('idle'), 2000);
  };

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
    setAvatarMood('thinking');
    
    try {
      // Add user message
      addMessage({ text: input, sender: 'user' });
      const userInput = input;
      setInput('');
      
      // Get AI response
      const response = await simulateAIResponse(userInput);
      addMessage({ text: response, sender: 'ai' });
      
      // Reset avatar mood after response
      setTimeout(() => setAvatarMood('idle'), 2000);
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        text: 'Sorry, there was an error processing your message.',
        sender: 'ai',
      });
      setAvatarMood('idle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="chat-container glass-card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* AI Avatar Section */}
      <motion.div 
        className="chat-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Avatar 
          mood={avatarMood} 
          size="medium" 
          onClick={handleAvatarClick}
        />
        <div className="chat-status">
          <h3>AI Assistant</h3>
          <p className={`status-indicator ${isLoading ? 'thinking' : 'idle'}`}>
            {isLoading ? 'Thinking...' : 'Ready to help'}
          </p>
        </div>
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
            className="chat-input glass-card"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            className="send-button neon-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <motion.div
                className="loading-spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="spinner"></div>
              </motion.div>
            ) : (
              <span>💬</span>
            )}
            {t('pages.chat.send')}
          </motion.button>
        </div>
      </motion.form>

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
        {isLoading && (
          <motion.div 
            className="typing-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};