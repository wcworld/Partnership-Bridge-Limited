import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin' | 'system';
  message: string;
  timestamp: Date;
  senderName?: string;
}

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'system',
      message: 'Hello! How can we help you with your bridge finance needs today?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const sessionId = useRef(Math.random().toString(36).substr(2, 9));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages from database
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId.current)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      if (data && data.length > 0) {
        const dbMessages: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          sender: msg.sender_type as 'user' | 'admin',
          message: msg.message,
          timestamp: new Date(msg.created_at),
          senderName: msg.sender_name
        }));

        // Only add system message if no messages exist
        const allMessages = dbMessages.length === 0 ? [
          {
            id: '1',
            sender: 'system' as const,
            message: 'Hello! How can we help you with your bridge finance needs today?',
            timestamp: new Date()
          },
          ...dbMessages
        ] : dbMessages;

        setMessages(allMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages periodically when chat is open and user info is provided
  useEffect(() => {
    if (!isOpen || !hasProvidedInfo) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [isOpen, hasProvidedInfo]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!hasProvidedInfo) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId.current}`
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMessage: ChatMessage = {
            id: payload.new.id,
            sender: payload.new.sender_type,
            message: payload.new.message,
            timestamp: new Date(payload.new.created_at),
            senderName: payload.new.sender_name
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hasProvidedInfo]);

  const sendToTelegram = async (message: string) => {
    try {
      const response = await fetch('https://bwrcctrisqeqnhwhbosy.supabase.co/functions/v1/telegram-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          message: message,
          timestamp: new Date().toLocaleString(),
          sessionId: sessionId.current
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!hasProvidedInfo) {
      toast({
        title: "Information Required",
        description: "Please provide your name and email first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const messageToSend = newMessage;
    setNewMessage('');

    try {
      await sendToTelegram(messageToSend);
      
      toast({
        title: "Message Sent",
        description: "Our team will get back to you shortly!",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name.trim() && userInfo.email.trim()) {
      setHasProvidedInfo(true);
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'system',
        message: `Thanks ${userInfo.name}! You can now send us messages and our team will respond directly.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, welcomeMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-80 shadow-xl transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-96'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-sm font-medium">
          Live Chat Support
        </CardTitle>
        <div className="flex gap-1">
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            Online
          </Badge>
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          {!hasProvidedInfo ? (
            <form onSubmit={handleSubmitInfo} className="p-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                Please provide your details to start chatting:
              </div>
              <Input
                placeholder="Your name"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="Your email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Button type="submit" className="w-full">
                Start Chat
              </Button>
            </form>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-2 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.sender === 'admin'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.sender === 'admin' && (
                        <div className="text-xs font-medium mb-1 opacity-70">
                          {message.senderName || 'Support Team'}
                        </div>
                      )}
                      {message.message}
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[40px] max-h-[80px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !newMessage.trim()}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};