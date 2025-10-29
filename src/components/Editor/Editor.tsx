import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Switch from '@radix-ui/react-switch';
import { useEditorStore } from '@/hooks/useEditor';
import { useAIService } from '../../hooks/useAIService';
import { Avatar } from '../Character/Avatar';
import './Editor.scss';

interface AIPromptOption {
  id: string;
  label: string;
  prompt: string;
  systemMessage: string;
}

export const Editor: React.FC = () => {
  const { t } = useTranslation();
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
  const [activeTab, setActiveTab] = useState<'generate' | 'text' | 'analyze'>('generate');
  const [avatarMood, setAvatarMood] = useState<'idle' | 'thinking' | 'talking' | 'happy'>('idle');

  const promptOptions: AIPromptOption[] = [
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

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    
    setAvatarMood('thinking');
    try {
      await generateImage({
        prompt: imagePrompt,
        size: '512x512',
        quality: 'standard'
      });
      setAvatarMood('happy');
      setImagePrompt('');
    } catch (error) {
      console.error('Image generation failed:', error);
      setAvatarMood('idle');
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
    
    setAvatarMood('thinking');
    try {
      const result = await analyzeImage(selectedImageForAnalysis);
      setImageAnalysis(result);
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

  return (
    <div className="editor-container glass-card">
      {/* Header with Avatar */}
      <motion.div 
        className="editor-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <Avatar 
            mood={avatarMood} 
            size="small" 
            onClick={handleAvatarClick}
          />
          <div className="header-info">
            <h2>{t('editor.title')}</h2>
            <p>AI-Powered Creative Editor</p>
          </div>
        </div>
        
        <div className="mode-toggle">
          <span className="toggle-label">{t('editor.editMode')}</span>
          <Switch.Root
            checked={mode === 'edit'}
            onCheckedChange={(checked) => setMode(checked ? 'edit' : 'view')}
            className="switch-root"
          >
            <Switch.Thumb className="switch-thumb" />
          </Switch.Root>
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
          { id: 'text', label: '📝 テキスト生成', icon: '📝' },
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
      <motion.div 
        className="editor-content"
        layout
        transition={{ duration: 0.5 }}
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
                    className="prompt-input glass-card"
                    disabled={isGeneratingImage}
                  />
                  <motion.button
                    onClick={handleImageGeneration}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="generate-button neon-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isGeneratingImage ? '生成中...' : '生成'}
                  </motion.button>
                </div>
                
                {/* Generated Images Gallery */}
                <div className="images-gallery">
                  <AnimatePresence>
                    {generatedImages.map((image) => (
                      <motion.div
                        key={image.id}
                        className="generated-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                        drag={mode === 'edit'}
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <img src={image.url} alt={image.prompt} />
                        <div className="image-info">
                          <p className="image-prompt">{image.prompt}</p>
                          <span className="image-timestamp">
                            {image.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'text' && (
            <motion.div
              key="text"
              className="tab-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-generation-section">
                <h3>📝 AIテキスト生成</h3>
                <div className="input-group">
                  <textarea
                    placeholder="生成したいテキストのトピックを入力してください..."
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    className="prompt-textarea glass-card"
                    disabled={isGeneratingText}
                    rows={3}
                  />
                </div>
                
                <div className="prompt-options">
                  {promptOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleTextGeneration(option.systemMessage)}
                      disabled={isGeneratingText || !textPrompt.trim()}
                      className="option-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
                
                {generatedText && (
                  <motion.div
                    className="generated-text glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4>生成されたテキスト：</h4>
                    <p>{generatedText}</p>
                  </motion.div>
                )}
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
                <div className="image-selector">
                  <p>解析する画像を選択してください：</p>
                  <div className="selectable-images">
                    {generatedImages.map((image) => (
                      <motion.div
                        key={image.id}
                        className={`selectable-image ${selectedImageForAnalysis === image.url ? 'selected' : ''}`}
                        onClick={() => setSelectedImageForAnalysis(image.url)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img src={image.url} alt={image.prompt} />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.button
                  onClick={handleImageAnalysis}
                  disabled={isAnalyzingImage || !selectedImageForAnalysis}
                  className="analyze-button neon-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAnalyzingImage ? '解析中...' : '解析開始'}
                </motion.button>
                
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};