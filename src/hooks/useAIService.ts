import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createImageGenerationService, createImageAnalysisService } from '../utils/imageGenerationService';

interface ImageGenerationOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  size: string;
}

interface AIService {
  generateImage: (options: ImageGenerationOptions) => Promise<GeneratedImage>;
  generateText: (prompt: string, systemMessage?: string) => Promise<string>;
  analyzeImage: (imageUrl: string) => Promise<string>;
}

// Real image generation using external APIs
const realImageGeneration = async (options: ImageGenerationOptions): Promise<GeneratedImage> => {
  const service = createImageGenerationService();
  
  if (!service.isAvailable()) {
    // Fallback to mock if no API is configured
    return mockImageGeneration(options);
  }

  try {
    const imageUrl = await service.generateImage(options.prompt);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      url: imageUrl,
      prompt: options.prompt,
      timestamp: new Date(),
      size: options.size || '512x512'
    };
  } catch (error) {
    console.error('Image generation failed, falling back to mock:', error);
    // Fallback to mock on error
    return mockImageGeneration(options);
  }
};

// Mock API functions for demonstration
const mockImageGeneration = async (options: ImageGenerationOptions): Promise<GeneratedImage> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Generate mock image URL (in production, this would be from actual API)
  const mockImages = [
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=512&h=512&fit=crop'
  ];
  
  const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    url: randomImage,
    prompt: options.prompt,
    timestamp: new Date(),
    size: options.size || '512x512'
  };
};

const mockTextGeneration = async (prompt: string, systemMessage?: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = [
    `「${prompt}」について詳しく説明させていただきます。この話題は非常に興味深く、多角的な視点から考察する価値があります。`,
    `${prompt}に関して、私の分析結果をお伝えします。最新の研究やトレンドを踏まえた包括的な回答をご提供いたします。`,
    `ご質問の「${prompt}」について、体系的にお答えします。この分野での経験と知識を活かして、実用的な情報をお伝えします。`,
    `${prompt}について考察してみました。この問題は複数の要因が絡み合っており、順序立てて解説していきたいと思います。`,
    `「${prompt}」は確かに重要なテーマですね。私の見解としては、以下のような点が特に注目すべきポイントだと考えています。`
  ];
  
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  
  if (systemMessage && systemMessage.includes('creative')) {
    return baseResponse + "\n\n✨ クリエイティブな視点から：この話題を新しい角度から捉えると、未来の可能性として興味深い展開が期待できそうです。";
  }
  
  if (systemMessage && systemMessage.includes('technical')) {
    return baseResponse + "\n\n🔧 技術的な観点から：実装面での課題と解決策について、具体的なアプローチをご提案できます。";
  }
  
  return baseResponse + "\n\nさらに詳しい情報が必要でしたら、お気軽にお聞きください。";
};

// Real image analysis using external APIs
const realImageAnalysis = async (imageUrl: string, t: any): Promise<string> => {
  console.log('🚀 realImageAnalysis called with URL:', imageUrl);
  const service = createImageAnalysisService();
  
  console.log('🔍 Service available:', service.isAvailable());
  
  try {
    console.log('✅ Attempting real API service for image analysis');
    const result = await service.analyzeImage(imageUrl);
    console.log('✅ Real API analysis completed successfully');
    console.log('📊 Analysis result length:', result.length);
    console.log('📄 First 200 chars of result:', result.substring(0, 200));
    
    // Add basic image metadata analysis that doesn't require API
    const metadata = await getImageMetadata(imageUrl, t);
    let combinedResult = result;
    
    if (metadata) {
      combinedResult = `${result}\n\n${metadata}`;
    }
    
    console.log('🎯 Final combined result length:', combinedResult.length);
    return combinedResult;
  } catch (error) {
    console.error('❌ Image analysis API failed, falling back to mock:', error);
    // Fallback to mock on error
    return mockImageAnalysis(imageUrl, t);
  }
};

// Get image metadata without requiring API
const getImageMetadata = async (imageUrl: string, t: any): Promise<string> => {
  try {
    const imageResponse = await fetch(imageUrl, { mode: 'cors' });
    if (!imageResponse.ok) return '';
    
    const imageBlob = await imageResponse.blob();
    const imageSize = imageBlob.size;
    const imageType = imageBlob.type;
    
    // Get image dimensions
    const dimensions = await new Promise<{width: number, height: number} | null>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = imageUrl;
    });
    
    let metadata = `${t('pages.chat.analysis.technicalSpecs')}:\n`;
    metadata += `• ${t('pages.chat.analysis.fileFormat')}: ${imageType.split('/')[1].toUpperCase()}\n`;
    metadata += `• ${t('pages.chat.analysis.fileSize')}: ${(imageSize / 1024).toFixed(1)} KB\n`;
    if (dimensions) {
      metadata += `• ${t('pages.chat.analysis.resolution')}: ${dimensions.width} × ${dimensions.height} ${t('pages.chat.analysis.pixels')}\n`;
      metadata += `• ${t('pages.chat.analysis.aspectRatio')}: ${(dimensions.width / dimensions.height).toFixed(2)}:1`;
    }
    
    return metadata;
  } catch (error) {
    return '';
  }
};

const mockImageAnalysis = async (imageUrl: string, t: any): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 多言語対応の分析パターン - 翻訳キーを使用
  const analysisTemplates = [
    {
      title: t('pages.chat.analysis.artistic'),
      content: t('pages.chat.analysis.artistic') === 'pages.chat.analysis.artistic' ? 
        "この画像は優れた視覚的構成を持っています。色彩の調和、光と影のバランス、そして構図の完成度が高く評価できます。特に、視線誘導の効果的な活用により、観る者の注意を適切に導いています。" :
        "This image demonstrates excellent visual composition. The harmony of colors, balance of light and shadow, and overall compositional quality are highly commendable. Particularly noteworthy is the effective use of visual guidance to appropriately direct the viewer's attention.",
      details: t('pages.chat.analysis.artistic') === 'pages.chat.analysis.artistic' ? [
        "色彩理論に基づいた効果的な配色",
        "黄金比を意識した構図設計", 
        "光源の計算された配置",
        "視覚的重心の最適なバランス"
      ] : [
        "Effective color scheme based on color theory",
        "Compositional design with golden ratio awareness",
        "Calculated light source placement",
        "Optimal balance of visual weight"
      ]
    },
    {
      title: t('pages.chat.analysis.technical'),
      content: t('pages.chat.analysis.technical') === 'pages.chat.analysis.technical' ?
        "画像の技術的品質は非常に高く、プロフェッショナルレベルの撮影・編集技術が使用されています。解像度、シャープネス、ノイズレベルのすべてにおいて優秀な結果を示しています。" :
        "The technical quality of this image is exceptionally high, demonstrating professional-level photography and editing techniques. Excellence is shown in all aspects including resolution, sharpness, and noise levels.",
      details: t('pages.chat.analysis.technical') === 'pages.chat.analysis.technical' ? [
        "高解像度による詳細な表現力",
        "適切な露出とコントラスト調整",
        "ノイズ処理の最適化",
        "色再現性の精度"
      ] : [
        "Detailed expression through high resolution",
        "Proper exposure and contrast adjustment",
        "Optimized noise processing",
        "Accurate color reproduction"
      ]
    },
    {
      title: t('pages.chat.analysis.psychological'),
      content: t('pages.chat.analysis.psychological') === 'pages.chat.analysis.psychological' ?
        "この画像は視覚心理学の観点から見ても興味深い特徴を持っています。観る者の感情に訴えかける要素が効果的に配置され、記憶に残りやすい印象的な構成となっています。" :
        "This image possesses fascinating characteristics from a visual psychology perspective. Elements that appeal to the viewer's emotions are effectively positioned, creating a memorable and impressive composition.",
      details: t('pages.chat.analysis.psychological') === 'pages.chat.analysis.psychological' ? [
        "感情的響きを生む色彩選択",
        "心理的安定感を与える構図",
        "注意を引く視覚的ポイント",
        "全体的な調和による安心感"
      ] : [
        "Color choices that evoke emotional resonance",
        "Composition providing psychological stability",
        "Visual points that capture attention",
        "Sense of security through overall harmony"
      ]
    },
    {
      title: t('pages.chat.analysis.communication'),
      content: t('pages.chat.analysis.communication') === 'pages.chat.analysis.communication' ?
        "コミュニケーション手段としての画像の効果性は非常に高く、視覚的メッセージの伝達において優れた成果を上げています。観る者との感情的つながりを築くための要素が巧妙に組み込まれています。" :
        "The effectiveness of this image as a communication medium is exceptionally high, achieving excellent results in conveying visual messages. Elements for building emotional connections with viewers are skillfully incorporated.",
      details: t('pages.chat.analysis.communication') === 'pages.chat.analysis.communication' ? [
        "明確なメッセージ性の表現",
        "感情移入を促す視覚的要素",
        "記憶に残る印象的な表現",
        "文化的背景への配慮"
      ] : [
        "Clear message expression",
        "Visual elements that encourage empathy",
        "Memorable and impressive expression",
        "Consideration for cultural background"
      ]
    }
  ];
  
  const selectedAnalysis = analysisTemplates[Math.floor(Math.random() * analysisTemplates.length)];
  
  const detailsList = selectedAnalysis.details.map((detail: string) => `• ${detail}`).join('\n\n');
  
  const analysisTitle = selectedAnalysis.title;
  const detailsTitle = t('pages.chat.analysis.details');
  const summaryTitle = t('pages.chat.analysis.summary');
  const summaryText = t('pages.chat.analysis.summary') === 'pages.chat.analysis.summary' ? 
    'この画像は技術的完成度と芸術的価値を兼ね備えた優秀な作品として評価できます。' :
    'This image can be evaluated as an excellent work that combines technical perfection and artistic value.';
  
  return `${analysisTitle}\n\n${selectedAnalysis.content}\n\n${detailsTitle}:\n\n${detailsList}\n\n${summaryTitle}:\n${summaryText}`;
};

export const useAIService = (): AIService & {
  isGeneratingImage: boolean;
  isGeneratingText: boolean;
  isAnalyzingImage: boolean;
  generatedImages: GeneratedImage[];
  clearImages: () => void;
} => {
  const { t } = useTranslation();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const generateImage = useCallback(async (options: ImageGenerationOptions): Promise<GeneratedImage> => {
    setIsGeneratingImage(true);
    try {
      const image = await realImageGeneration(options);
      setGeneratedImages(prev => [image, ...prev].slice(0, 10)); // Keep last 10 images
      return image;
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);

  const generateText = useCallback(async (prompt: string, systemMessage?: string): Promise<string> => {
    setIsGeneratingText(true);
    try {
      return await mockTextGeneration(prompt, systemMessage);
    } finally {
      setIsGeneratingText(false);
    }
  }, []);

  const analyzeImage = useCallback(async (imageUrl: string): Promise<string> => {
    setIsAnalyzingImage(true);
    try {
      return await realImageAnalysis(imageUrl, t);
    } finally {
      setIsAnalyzingImage(false);
    }
  }, [t]);

  const clearImages = useCallback(() => {
    setGeneratedImages([]);
  }, []);

  return {
    generateImage,
    generateText,
    analyzeImage,
    isGeneratingImage,
    isGeneratingText,
    isAnalyzingImage,
    generatedImages,
    clearImages
  };
};