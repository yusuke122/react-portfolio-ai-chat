import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { Avatar } from '../Character/Avatar';
import { useEditorStore } from '@/hooks/useEditor';
import { useAIService } from '../../hooks/useAIService';
import { InteractiveCanvas } from '../Interactive/InteractiveCanvas';
import './ChatInterface.scss';

interface AIPromptOption {
  id: string;
  label: string;
  prompt: string;
  systemMessage: string;
}

export const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarMood, setAvatarMood] = useState<'idle' | 'thinking' | 'talking' | 'happy'>('idle');
  const [activeTab, setActiveTab] = useState<'generate' | 'text' | 'analyze'>('generate');
  const { mode, setMode, images } = useEditorStore();
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

  const avatarOptions: AIPromptOption[] = [
    {
      id: 'creative',
      label: 'クリエイティブ',
      prompt: '創造的で芸術的な内容を生成してください',
      systemMessage: 'creative artistic innovative'
    },
    {
      id: 'technical',
      label: 'テクニカル',
      prompt: '技術的で詳細な説明を生成してください',
      systemMessage: 'technical detailed precise'
    },
    {
      id: 'casual',
      label: 'カジュアル',
      prompt: 'フレンドリーで親しみやすい内容を生成してください',
      systemMessage: 'friendly casual approachable'
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
      text: `${currentAvatar.label}アバターでの生成: ${imagePrompt}`,
      sender: 'user',
      type: 'image_request'
    });
    
    setAvatarMood('thinking');
    setIsLoading(true);
    
    try {
      const result = await generateImage({
        prompt: enhancedPrompt,
        size: '512x512',
        quality: 'standard'
      });
      
      console.log('Generated image result:', result);
      
      // 生成が完了したら直接結果を使用
      addMessage({
        text: `${currentAvatar.label}アバターが画像を生成しました: "${imagePrompt}"`,
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
      addMessage({
        text: '画像生成に失敗しました。もう一度お試しください。',
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
      const result = await analyzeImage(selectedImageForAnalysis);
      setImageAnalysis(`${currentAvatar.label}アバターの分析: ${result}`);
      setAvatarMood('talking');
      setTimeout(() => setAvatarMood('idle'), 3000);
    } catch (error) {
      console.error('Image analysis failed:', error);
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
            <span className="nav-text">前のアバター</span>
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
            <span className="nav-text">次のアバター</span>
          </motion.button>
        </div>
        
        <div className="chat-status">
          <h3>AI Assistant</h3>
          <p className={`status-indicator ${isLoading ? 'thinking' : 'idle'}`}>
            {isLoading ? 'Thinking...' : 'Ready to help'}
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
          { id: 'generate', label: '🎨 画像生成', icon: '🎨' },
          { id: 'analyze', label: '🔍 画像解析', icon: '🔍' }
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
                <h3>🎨 AI画像生成</h3>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="生成したい画像の説明を入力してください..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="chat-input glass-card"
                    disabled={isGeneratingImage}
                  />
                  <motion.button
                    type="submit"
                    onClick={handleImageGeneration}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className={`send-button neon-glow ${isGeneratingImage ? 'generating' : ''}`}
                    whileHover={!isGeneratingImage ? { scale: 1.05 } : {}}
                    whileTap={!isGeneratingImage ? { scale: 0.95 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {isGeneratingImage ? (
                      <span>🎨 生成中...</span>
                    ) : (
                      <span>🎨 生成</span>
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
                <h3>🔍 AI画像解析</h3>
                <p className="debug-info">生成された画像数: {generatedImages.length}</p>

                {imageAnalysis && (
                  <motion.div
                    className="analysis-result glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4>解析結果：</h4>
                    <p>{imageAnalysis}</p>
                  </motion.div>
                )}

                <div className="image-selector">
                  <div className="selector-header">
                    <p>解析する画像を選択してください</p>
                    <motion.button
                      onClick={handleImageAnalysis}
                      disabled={isAnalyzingImage || !selectedImageForAnalysis}
                      className={`send-button neon-glow ${isAnalyzingImage ? 'analyzing' : ''}`}
                      whileHover={!isAnalyzingImage ? { scale: 1.05 } : {}}
                      whileTap={!isAnalyzingImage ? { scale: 0.95 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {isAnalyzingImage ? (
                        <span>🔍 解析中...</span>
                      ) : (
                        <span>🔍 解析開始</span>
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
                        <p>🎨 画像生成タブで画像を生成してから解析を行ってください</p>
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
