"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestTechnique, type SuggestTechniqueOutput } from '@/ai/flows/suggest-technique';
import LoadingSpinner from '@/components/loading-spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  suggestion?: SuggestTechniqueOutput;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div > div'); 
      if (scrollableView) {
        scrollableView.scrollTop = scrollableView.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    setMessages([
      {
        id: 'initial-bot-message',
        text: "Hello! I'm here to help. How are you feeling right now? You can tell me something like 'I'm feeling anxious' or 'I'm very stressed'.",
        sender: 'bot',
      }
    ]);
  }, []);


  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: new Date().toISOString(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      let feeling = currentInput;
      let intensity = "moderate"; 

      const intensityKeywords = {
        "very ": "severe", "extremely ": "severe", "really ": "severe",
        "a bit ": "mild", "slightly ": "mild", "a little ": "mild",
      };

      for (const keyword in intensityKeywords) {
        if (currentInput.toLowerCase().startsWith(keyword)) {
          intensity = intensityKeywords[keyword as keyof typeof intensityKeywords];
          feeling = currentInput.substring(keyword.length);
          break;
        }
      }
      
      const feelingPhrasesToRemove = ["i'm feeling ", "i am feeling ", "i feel ", "feeling "];
      for (const phrase of feelingPhrasesToRemove) {
        if (feeling.toLowerCase().startsWith(phrase)) {
          feeling = feeling.substring(phrase.length);
          break;
        }
      }

      const suggestion = await suggestTechnique({ feeling: feeling.trim(), intensity });
      const botResponse: Message = {
        id: new Date().toISOString() + '-bot',
        text: `${suggestion.technique} Here's why it might help: ${suggestion.reason}`,
        sender: 'bot',
        suggestion: suggestion,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Failed to get suggestion:", error);
      toast({
        title: "Error",
        description: "Sorry, I couldn't process that. Please try rephrasing or try again later.",
        variant: "destructive",
      });
      const errorResponse: Message = {
        id: new Date().toISOString() + '-error',
        text: "I'm having a little trouble understanding right now. Could you try telling me your feeling in a simple way, like 'anxious' or 'sad'?",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, toast]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)]">
      <PageTitle
        title="AI Chatbot"
        description="Engage in a supportive conversation. I can suggest simple techniques to help manage negative feelings."
      />

      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">Chat with MindFlow Bot</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${
                    message.sender === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                     <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end space-x-2">
                   <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  <div className="p-3 rounded-lg bg-muted shadow">
                    <LoadingSpinner size={20} />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <div className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              className="flex-1 bg-background focus:ring-accent"
              disabled={isLoading}
              suppressHydrationWarning 
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? <LoadingSpinner size={16} /> : 'Send'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}