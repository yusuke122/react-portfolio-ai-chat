import { useState, useCallback } from 'react';
import { create } from 'zustand';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}));

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { messages, addMessage, clearMessages } = useChatStore();

  const simulateAIResponse = async (text: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 簡単な応答ロジック
    const responses = [
      "そうですね、その考えは興味深いですね。もう少し詳しく教えていただけますか？",
      "なるほど、確かにその視点は重要ですね。私からは以下の提案もさせていただきたいと思います...",
      "その考えについて、別の角度からも見てみましょう。例えば...",
      "ご指摘ありがとうございます。その点については、さらに掘り下げて考えてみる必要がありそうですね。",
      "とても良い質問ですね。これについて、以下のような観点から考えてみましょう..."
    ];
    
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      return "こんにちは！お手伝いできることはありますか？";
    }
    
    if (text.includes('?') || text.includes('？')) {
      return "良い質問ですね。" + responses[Math.floor(Math.random() * 3)];
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = useCallback(
    async (text: string) => {
      addMessage({ text, sender: 'user' });
      setIsLoading(true);

      try {
        const response = await simulateAIResponse(text);
        addMessage({
          text: response,
          sender: 'ai',
        });
      } catch (error) {
        console.error('Error sending message:', error);
        addMessage({
          text: 'Sorry, there was an error processing your message.',
          sender: 'ai',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
  );

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
  };
};