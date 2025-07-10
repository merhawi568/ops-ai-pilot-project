
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, MessageSquare } from 'lucide-react';

export const VoiceChatAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message logic would go here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">AI Assistant</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          ×
        </Button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm">Hello! I can help you with your applications. Try asking:</p>
            <ul className="text-xs mt-2 space-y-1 text-gray-600">
              <li>• "Show me apps missing documents"</li>
              <li>• "Explain why TechCorp was escalated"</li>
              <li>• "What needs urgent attention?"</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type or speak your question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={handleVoiceToggle}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
