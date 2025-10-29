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

  const sendMessage = useCallback(
    async (text: string) => {
      // Add user message
      addMessage({ text, sender: 'user' });
      setIsLoading(true);

      try {
        // Simulate AI response (replace with actual API call)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addMessage({
          text: `You said: ${text}. This is a simulated AI response.`,
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