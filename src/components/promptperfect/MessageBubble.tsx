
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Zap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  onOptimize: (content: string) => void;
  onSendToAssistant: (content: string) => void;
  showOptimize: boolean;
  showSendToAssistant: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onOptimize,
  onSendToAssistant,
  showOptimize,
  showSendToAssistant
}) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] relative group ${isUser ? 'ml-4' : 'mr-4'}`}>
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-purple-600 text-white'
              : 'bg-muted text-foreground'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        {/* 用户消息的操作按钮 */}
        {isUser && (showOptimize || showSendToAssistant) && (
          <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              {showOptimize && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onOptimize(message.content)}
                  className="h-6 w-6 p-0 bg-white shadow-md hover:bg-gray-50"
                  title="Optimize"
                >
                  <Zap className="w-3 h-3 text-purple-600" />
                </Button>
              )}
              {showSendToAssistant && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onSendToAssistant(message.content)}
                  className="h-6 w-6 p-0 bg-white shadow-md hover:bg-gray-50"
                  title="Send to Assistant"
                >
                  <Send className="w-3 h-3 text-purple-600" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
