import React, { useEffect, useRef } from 'react';
import type { ChatMessage as MessageType, Persona, Theme, GenerationMode, ProjectState } from '../types';
import { Theme as ThemeEnum } from '../types';
import { Message } from './Message';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatWindowProps {
  chatHistory: MessageType[];
  onSaveTrainingExample: (messageId: string, editedText: string) => void;
  persona: Persona;
  theme: Theme;
  isLoading: boolean;
  generationMode: GenerationMode;
  onRegenerateResponse: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  chatHistory, onSaveTrainingExample, theme, persona, isLoading, generationMode, onRegenerateResponse
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  const placeholderText = {
      [ThemeEnum.LIGHT]: "text-gray-500",
      [ThemeEnum.DARK]: "text-gray-500",
      [ThemeEnum.TRANSPARENT]: "text-gray-400",
  };

  const scrollbarClasses = {
      [ThemeEnum.LIGHT]: "scrollbar-thumb-gray-400 [&::-webkit-scrollbar-thumb]:bg-gray-400/70 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400",
      [ThemeEnum.DARK]: "scrollbar-thumb-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-600/70 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600",
      [ThemeEnum.TRANSPARENT]: "scrollbar-thumb-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-600/70 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600",
  }
  
  const visibleHistory = chatHistory.filter(msg => !msg.isHidden);
  const lastModelMessageIndex = visibleHistory.map(m => m.role).lastIndexOf('model');


  return (
    <div className="h-full flex flex-col">
      <div 
          ref={scrollRef} 
          className={`
              flex-grow overflow-y-auto px-4 lg:px-8 pt-4 space-y-4
              scrollbar-thin scrollbar-track-transparent 
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:transition-colors
              ${scrollbarClasses[theme]}
          `}
      >
        {visibleHistory.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full text-center">
              <p className={placeholderText[theme]}>What's on your mind?</p>
          </div>
        )}
        {visibleHistory.map((msg, index) => {
          const isLastMessage = index === visibleHistory.length - 1;
          const isStreaming = isLastMessage && isLoading && msg.role === 'model';
          const isLastModelMessage = msg.role === 'model' && index === lastModelMessageIndex;

          return (
            <Message
              key={msg.id}
              message={msg}
              persona={persona}
              onSaveEdit={onSaveTrainingExample}
              isEditable={msg.role === 'model' && !!msg.text.trim()}
              isStreaming={isStreaming}
              theme={theme}
              onRegenerate={onRegenerateResponse}
              isLastModelMessage={isLastModelMessage && !isStreaming}
            />
          );
        })}
        {isLoading && visibleHistory.length === 0 && (
            <Message
              key="loading-placeholder"
              message={{ id: 'loading-placeholder', role: 'model', text: '' }}
              persona={persona}
              onSaveEdit={() => {}}
              isEditable={false}
              isStreaming={true}
              theme={theme}
              onRegenerate={() => {}}
              isLastModelMessage={false}
          />
        )}
        {isLoading && generationMode === 'Thinking' && (
          <ThinkingIndicator theme={theme} />
        )}
      </div>
    </div>
  );
};