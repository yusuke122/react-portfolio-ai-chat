import React, { useState, FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { Avatar } from '../Character/Avatar';
import { useAIService } from '../../hooks/useAIService';
import { debugEnvVars } from '../../utils/debugEnv';
import './ChatInterface.scss';

// Custom hook for detecting mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

interface AIPromptOption {
  id: string;
  label: string;
  prompt: string;
  systemMessage: string;
}

export const ChatInterface: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarMood, setAvatarMood] = useState<'idle' | 'thinking' | 'talking' | 'happy'>('idle');
  const [activeTab, setActiveTab] = useState<'generate' | 'text' | 'analyze'>('generate');
  const { 
    generateImage, 
    generateText, 
    analyzeImage,
    isGeneratingImage, 
    isGeneratingText,
    isAnalyzingImage,
    generatedImages 
  } = useAIService();

  const [imagePrompt, setImagePrompt] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [selectedImageForAnalysis, setSelectedImageForAnalysis] = useState<string>('');
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('creative');

  // Mobile detection hook
  const isMobile = useIsMobile();

  // Function to format text with mobile line breaks
  const formatMobileText = (text: string, breakAfter?: string) => {
    if (!isMobile) return text;
    
    const currentLanguage = i18n.language;
    
    if (currentLanguage === 'ja') {
      // Japanese: break after 'の'
      return text.replace('の', 'の\n');
    } else if (currentLanguage === 'en') {
      // English: break after specified word or default behavior
      if (breakAfter) {
        return text.replace(breakAfter, `${breakAfter}\n`);
      }
      // For avatar buttons, break after first word (Previous/Next)
      return text.replace(' ', '\n');
    }
    
    return text;
  };

  // Debug environment variables on component mount
  useEffect(() => {
    console.log('🎯 ChatInterface mounted, checking environment...');
    debugEnvVars();
  }, []);

  // Debug imageAnalysis state changes
  useEffect(() => {
    console.log('[ChatInterface] imageAnalysis state changed:', imageAnalysis);
    console.log('[ChatInterface] imageAnalysis length:', imageAnalysis.length);
    console.log('[ChatInterface] imageAnalysis empty?', !imageAnalysis);
  }, [imageAnalysis]);

  const avatarOptions: AIPromptOption[] = [
    {
      id: 'creative',
      label: t('pages.chat.avatars.creative'),
      prompt: t('pages.chat.avatarPrompts.creative'),
      systemMessage: 'creative artistic innovative'
    },
    {
      id: 'technical',
      label: t('pages.chat.avatars.technical'),
      prompt: t('pages.chat.avatarPrompts.technical'),
      systemMessage: 'technical detailed precise'
    },
    {
      id: 'casual',
      label: t('pages.chat.avatars.casual'),
      prompt: t('pages.chat.avatarPrompts.casual'),
      systemMessage: 'friendly casual approachable'
    },
    {
      id: 'professional',
      label: t('pages.chat.avatars.professional'),
      prompt: t('pages.chat.avatarPrompts.professional'),
      systemMessage: 'professional polite formal'
    }
  ];

  const getCurrentAvatar = () => {
    return avatarOptions.find(option => option.id === selectedAvatarId) || avatarOptions[0];
  };

  const handlePreviousAvatar = () => {
    const currentIndex = avatarOptions.findIndex(option => option.id === selectedAvatarId);
    const previousIndex = currentIndex === 0 ? avatarOptions.length - 1 : currentIndex - 1;
    setSelectedAvatarId(avatarOptions[previousIndex].id);
    setAvatarMood('happy');
    setTimeout(() => setAvatarMood('idle'), 1000);
  };

  const handleNextAvatar = () => {
    const currentIndex = avatarOptions.findIndex(option => option.id === selectedAvatarId);
    const nextIndex = currentIndex === avatarOptions.length - 1 ? 0 : currentIndex + 1;
    setSelectedAvatarId(avatarOptions[nextIndex].id);
    setAvatarMood('happy');
    setTimeout(() => setAvatarMood('idle'), 1000);
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    
    const currentAvatar = getCurrentAvatar();
    const enhancedPrompt = `${currentAvatar.systemMessage} style: ${imagePrompt}`;
    
    // ユーザーメッセージを追加
    addMessage({
      text: `${t(`pages.chat.avatars.${currentAvatar.id}`)}${t('pages.chat.messages.avatarGeneration')}: ${imagePrompt}`,
      sender: 'user',
      type: 'image_request'
    });
    
    setAvatarMood('thinking');
    setIsLoading(true);
    
    try {
      const result = await generateImage({
        prompt: enhancedPrompt,
        size: '256x256',
        quality: 'standard'
      });
      
      console.log('Generated image result:', result);
      
      // 生成が完了したら直接結果を使用
      addMessage({
        text: `${t(`pages.chat.avatars.${currentAvatar.id}`)}${t('pages.chat.analysis.avatarGenerated')}: "${imagePrompt}"`,
        sender: 'ai',
        type: 'image_response',
        imageUrl: result.url,
        imagePrompt: enhancedPrompt
      });
      
      console.log('Added message with image URL:', result.url);
      
      setAvatarMood('happy');
      setImagePrompt(''); // 入力をクリア
      setTimeout(() => setAvatarMood('idle'), 2000);
    } catch (error) {
      console.error('Image generation failed:', error);
      
      let errorMessage = t('pages.chat.status.error');
      
      if (error instanceof Error) {
        if (error.message.includes('No image generation service configured')) {
          errorMessage = t('pages.chat.status.error');
        } else if (error.message.includes('Model is loading')) {
          errorMessage = t('pages.chat.status.generating');
        } else if (error.message.includes('API token not configured')) {
          errorMessage = t('pages.chat.status.error');
        }
      }
      
      addMessage({
        text: errorMessage,
        sender: 'ai',
        type: 'error'
      });
      setAvatarMood('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextGeneration = async (systemMessage?: string) => {
    if (!textPrompt.trim()) return;
    
    setAvatarMood('thinking');
    try {
      const result = await generateText(textPrompt, systemMessage);
      setGeneratedText(result);
      setAvatarMood('talking');
      setTimeout(() => setAvatarMood('idle'), 3000);
    } catch (error) {
      console.error('Text generation failed:', error);
      setAvatarMood('idle');
    }
  };

  const handleImageAnalysis = async () => {
    if (!selectedImageForAnalysis) return;
    
    const currentAvatar = getCurrentAvatar();
    setAvatarMood('thinking');
    try {
      console.log('[ChatInterface] Starting image analysis for avatar:', currentAvatar.id);
      const result = await analyzeImage(selectedImageForAnalysis);
      console.log('[ChatInterface] Analysis result received:', result);
      console.log('[ChatInterface] Result type:', typeof result);
      console.log('[ChatInterface] Result length:', result?.length || 0);
      
      const analysisMessage = `${t(`pages.chat.avatars.${currentAvatar.id}`)}${t('pages.chat.messages.avatarAnalysis')}: ${result}`;
      console.log('[ChatInterface] Final analysis message:', analysisMessage);
      
      setImageAnalysis(analysisMessage);
      setAvatarMood('talking');
      setTimeout(() => setAvatarMood('idle'), 3000);
    } catch (error) {
      console.error('[ChatInterface] Image analysis failed:', error);
      
      let errorMessage = t('pages.chat.status.error');
      
      if (error instanceof Error) {
        if (error.message.includes('No image analysis service configured')) {
          errorMessage = t('pages.chat.status.error');
        } else if (error.message.includes('Image analysis model is loading')) {
          errorMessage = t('pages.chat.status.error');
        } else if (error.message.includes('API token not configured')) {
          errorMessage = t('pages.chat.status.error');
        }
      }
      
      setImageAnalysis(`❌ ${errorMessage}`);
      setAvatarMood('idle');
    }
  };

  const handleAvatarClick = () => {
    setAvatarMood('happy');
    setTimeout(() => setAvatarMood('idle'), 2000);
  };
  const simulateAIResponse = async (text: string) => {
    setAvatarMood('thinking');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = t('pages.chat.messages.responses.generic', { returnObjects: true }) as string[];
    
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      setAvatarMood('happy');
      return t('pages.chat.messages.responses.hello');
    }
    
    if (text.includes('?') || text.includes('？')) {
      setAvatarMood('talking');
      return t('pages.chat.messages.responses.question') + responses[Math.floor(Math.random() * 3)];
    }
    
    setAvatarMood('talking');
    return responses[Math.floor(Math.random() * responses.length)];
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
    
    if (activeTab === 'generate' && imagePrompt.trim()) {
      await handleImageGeneration();
      return;
    }
    
    // 画像解析タブの場合
    if (activeTab === 'analyze') {
      await handleImageAnalysis();
      return;
    }
    
    // 通常のチャット入力の場合（現在は使用されていませんが、将来の拡張用）
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
      className={`chat-container glass-card ${activeTab === 'analyze' ? 'analyze-mode' : ''}`}
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
        <div className="avatar-selector">
          <motion.button 
            className="avatar-nav-button prev"
            onClick={handlePreviousAvatar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="arrow">＜</span>
            <span className="nav-text">
              {formatMobileText(t('pages.chat.previousAvatar'))}
            </span>
          </motion.button>
          
          <div className="avatar-center">
            <Avatar 
              mood={avatarMood} 
              size="medium" 
              type={selectedAvatarId as 'creative' | 'technical' | 'casual'}
              onClick={handleAvatarClick}
            />
            <div className="avatar-info">
              <h4 className="avatar-name">{getCurrentAvatar().label}</h4>
              <p className="avatar-description">{getCurrentAvatar().prompt}</p>
              <div className="avatar-indicator">
                {avatarOptions.map((option, index) => (
                  <span 
                    key={option.id}
                    className={`indicator-dot ${option.id === selectedAvatarId ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <motion.button 
            className="avatar-nav-button next"
            onClick={handleNextAvatar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="arrow">＞</span>
            <span className="nav-text">
              {formatMobileText(t('pages.chat.nextAvatar'))}
            </span>
          </motion.button>
        </div>
        
        <div className="chat-status">
          <h3>AI Assistant</h3>
          <p className={`status-indicator ${isLoading ? 'thinking' : 'idle'}`}>
            {isLoading ? t('pages.chat.thinking') : 'Ready to help'}
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="tab-navigation"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {[
          { id: 'generate', label: t('pages.chat.imageGeneration'), icon: '🎨' },
          { id: 'analyze', label: t('pages.chat.imageAnalysis'), icon: '🔍' }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Content Area */}
      <motion.form 
        layout
        onSubmit={handleSubmit} 
        className="chat-input-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'generate' && (
            <motion.div
              key="generate"
              className="tab-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="generation-section">
                <h3>🎨 {t('pages.chat.sections.imageGeneration')}</h3>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder={t('pages.chat.prompts.imagePlaceholder')}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="chat-input glass-card"
                    disabled={isGeneratingImage}
                  />
                  <motion.button
                    type="submit"
                    onClick={handleImageGeneration}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className={`send-button neon-glow ${isGeneratingImage ? 'generating' : ''} ${isMobile && i18n.language === 'ja' ? 'japanese-mobile' : ''}`}
                    whileHover={!isGeneratingImage ? { scale: 1.05 } : {}}
                    whileTap={!isGeneratingImage ? { scale: 0.95 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {isGeneratingImage ? (
                      <span>🎨 {t('pages.chat.status.imageGenerating')}</span>
                    ) : (
                      <span>🎨 {formatMobileText(t('pages.chat.generateImage'), 'Generate')}</span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              className="tab-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="analysis-section">
                <h3>🔍 {t('pages.chat.analysis.title')}</h3>
                <p className="debug-info">{t('pages.chat.analysis.generatedImages')}: {generatedImages.length}</p>

                {/* DEBUG: Checking if imageAnalysis should render: ${!!imageAnalysis}, value: ${imageAnalysis} */}
                {imageAnalysis && (
                  <>
                    <motion.div
                      className="analysis-result glass-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h4>{t('pages.chat.analysis.resultTitle')}：</h4>
                      <p className="analysis-result">{imageAnalysis}</p>
                    </motion.div>
                  </>
                )}

                <div className="image-selector">
                  <div className="selector-header">
                    <p>{t('pages.chat.analysis.selectImage')}</p>
                    <motion.button
                      onClick={handleImageAnalysis}
                      disabled={isAnalyzingImage || !selectedImageForAnalysis}
                      className={`send-button neon-glow ${isAnalyzingImage ? 'analyzing' : ''}`}
                      whileHover={!isAnalyzingImage ? { scale: 1.05 } : {}}
                      whileTap={!isAnalyzingImage ? { scale: 0.95 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {isAnalyzingImage ? (
                        <span>🔍 {t('pages.chat.status.analyzing')}</span>
                      ) : (
                        <span>🔍 {t('pages.chat.analyzeImage')}</span>
                      )}
                    </motion.button>
                  </div>
                  <div className="selectable-images">
                    {generatedImages.length > 0 ? (
                      generatedImages.map((image) => (
                        <motion.div
                          key={image.id}
                          className={`selectable-image ${selectedImageForAnalysis === image.url ? 'selected' : ''}`}
                          onClick={() => setSelectedImageForAnalysis(image.url)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img src={image.url} alt={image.prompt} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="no-images-message">
                        <p>{t('pages.chat.analysis.noGeneratedImages')}</p>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Messages Container */}
      <motion.div
        className="messages-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
