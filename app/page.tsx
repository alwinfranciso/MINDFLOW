"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { generateDailyPrompt, type GenerateDailyPromptOutput } from '@/ai/flows/daily-prompt';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  mood?: string;
  content: string;
}

const moods = ["Happy", "Sad", "Anxious", "Calm", "Energetic", "Tired", "Inspired", "Stressed", "Grateful", "Reflective"];

export default function JournalPage() {
  const [prompt, setPrompt] = useState<GenerateDailyPromptOutput | null>(null);
  const [currentMood, setCurrentMood] = useState<string>(moods[0]);
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrompt = async () => {
      setIsLoadingPrompt(true);
      try {
        const result = await generateDailyPrompt({ userMood: currentMood });
        setPrompt(result);
      } catch (error) {
        console.error("Failed to generate prompt:", error);
        toast({
          title: "Error",
          description: "Could not fetch daily prompt. Please try again.",
          variant: "destructive",
        });
        // Fallback prompt
        setPrompt({ prompt: "What are you grateful for today?" });
      } finally {
        setIsLoadingPrompt(false);
      }
    };
    fetchPrompt();
  }, [currentMood, toast]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  const handleSaveEntry = useCallback(() => {
    if (!journalText.trim() || !prompt) return;
    setIsSaving(true);
    const newEntry: JournalEntry = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      prompt: prompt.prompt,
      mood: currentMood,
      content: journalText,
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setJournalText('');
    toast({
      title: "Entry Saved",
      description: "Your journal entry has been successfully saved.",
    });
    setIsSaving(false);
  }, [journalText, prompt, currentMood, entries, toast]);

  return (
    <div className="space-y-8">
      <PageTitle
        title="Daily Journal"
        description="Reflect on your thoughts and feelings with today's personalized prompt."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">Today's Prompt</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2">
            <p className="text-sm text-foreground/80">Select your current mood to personalize your prompt:</p>
            <Select value={currentMood} onValueChange={setCurrentMood}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoadingPrompt ? (
            <div className="flex items-center space-x-2 mt-4 text-muted-foreground">
              <LoadingSpinner size={16} />
              <span>Generating your prompt...</span>
            </div>
          ) : (
            prompt && <CardDescription className="text-lg mt-4">{prompt.prompt}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your thoughts here..."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            rows={8}
            className="bg-background focus:ring-accent"
            disabled={isLoadingPrompt}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveEntry} disabled={!journalText.trim() || isLoadingPrompt || isSaving} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSaving ? <LoadingSpinner size={16} className="mr-2" /> : null}
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Button>
        </CardFooter>
      </Card>

      {entries.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">Past Entries</h2>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {entries.map((entry) => (
                <Card key={entry.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline text-primary">{format(new Date(entry.date), "MMMM d, yyyy 'at' h:mm a")}</CardTitle>
                    {entry.mood && <p className="text-sm text-muted-foreground">Mood: {entry.mood}</p>}
                    <CardDescription className="italic pt-1">Prompt: {entry.prompt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-foreground/90">{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}