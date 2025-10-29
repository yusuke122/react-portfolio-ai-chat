import { useState, useCallback } from 'react';

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

const mockImageAnalysis = async (imageUrl: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const analyses = [
    "この画像は美しい自然風景を捉えており、構図や色彩バランスが非常に印象的です。",
    "画像から読み取れる要素として、光の使い方や被写体の配置に優れた技術が見られます。",
    "この画像は視覚的に魅力的で、感情的な響きを持つ素晴らしい作品だと分析できます。",
    "画像の品質と表現力は高く、プロフェッショナルなレベルの撮影技術が使用されています。"
  ];
  
  return analyses[Math.floor(Math.random() * analyses.length)];
};

export const useAIService = (): AIService & {
  isGeneratingImage: boolean;
  isGeneratingText: boolean;
  isAnalyzingImage: boolean;
  generatedImages: GeneratedImage[];
  clearImages: () => void;
} => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const generateImage = useCallback(async (options: ImageGenerationOptions): Promise<GeneratedImage> => {
    setIsGeneratingImage(true);
    try {
      const image = await mockImageGeneration(options);
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
      return await mockImageAnalysis(imageUrl);
    } finally {
      setIsAnalyzingImage(false);
    }
  }, []);

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