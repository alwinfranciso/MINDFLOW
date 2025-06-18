"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BarChart, LineChart as LChartIcon, Smile, Frown, Meh, Laugh, Angry } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface MoodEntry {
  date: string; // ISO string
  mood: number; // 1-5
  emoji: string;
  label: string;
}

const moodOptions = [
  { value: 5, emoji: "😄", label: "Great", icon: <Laugh className="w-8 h-8 text-green-500" /> },
  { value: 4, emoji: "🙂", label: "Good", icon: <Smile className="w-8 h-8 text-lime-500" /> },
  { value: 3, emoji: "😐", label: "Okay", icon: <Meh className="w-8 h-8 text-yellow-500" /> },
  { value: 2, emoji: "😟", label: "Bad", icon: <Frown className="w-8 h-8 text-orange-500" /> },
  { value: 1, emoji: "😞", label: "Awful", icon: <Angry className="w-8 h-8 text-red-500" /> },
];

const chartConfig = {
  mood: {
    label: "Mood Level",
    color: "hsl(var(--primary))",
    icon: LChartIcon,
  },
} satisfies import("@/components/ui/chart").ChartConfig;

export default function MoodTrackerPage() {
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedMoodLog = localStorage.getItem('moodLog');
    if (storedMoodLog) {
      setMoodLog(JSON.parse(storedMoodLog).map((entry: MoodEntry) => ({
        ...entry,
        date: entry.date, 
      })));
    }
  }, []);

  const handleLogMood = useCallback(() => {
    if (selectedMood === null) {
      toast({
        title: "No Mood Selected",
        description: "Please select a mood to log.",
        variant: "destructive",
      });
      return;
    }

    const moodOption = moodOptions.find(m => m.value === selectedMood);
    if (!moodOption) return;

    const today = new Date().toISOString().split('T')[0]; 
    const todayLogIndex = moodLog.findIndex(entry => entry.date.startsWith(today));

    let updatedLog;
    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood: selectedMood,
      emoji: moodOption.emoji,
      label: moodOption.label,
    };

    if (todayLogIndex > -1) {
      updatedLog = [...moodLog];
      updatedLog[todayLogIndex] = newEntry;
    } else {
      updatedLog = [...moodLog, newEntry];
    }
    
    updatedLog.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setMoodLog(updatedLog);
    localStorage.setItem('moodLog', JSON.stringify(updatedLog));
    setSelectedMood(null);
    toast({
      title: "Mood Logged",
      description: `You've logged your mood as: ${moodOption.label} ${moodOption.emoji}`,
    });
  }, [selectedMood, moodLog, toast]);
  
  const chartData = useMemo(() => {
    const last7DaysData: { date: string; mood: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const formattedDate = format(d, "MMM d");
      const entry = moodLog.find(log => format(parseISO(log.date), "yyyy-MM-dd") === format(d, "yyyy-MM-dd"));
      last7DaysData.push({ date: formattedDate, mood: entry ? entry.mood : null });
    }
    return last7DaysData;
  }, [moodLog]);

  return (
    <div className="space-y-8">
      <PageTitle
        title="Mood Tracker"
        description="Log your daily mood and visualize your emotional well-being over time."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">How are you feeling today?</CardTitle>
          <CardDescription>Select an emoji that best represents your current mood.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex space-x-2 sm:space-x-4">
            {moodOptions.map((mood) => (
              <Button
                key={mood.value}
                variant="outline"
                className={`p-2 sm:p-4 rounded-full h-auto transition-all duration-200 ease-in-out transform hover:scale-110
                  ${selectedMood === mood.value ? 'ring-4 ring-accent bg-accent/20' : 'bg-background'}`}
                onClick={() => setSelectedMood(mood.value)}
                aria-label={`Select mood: ${mood.label}`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl sm:text-3xl" role="img" aria-label={mood.label}>{mood.emoji}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{mood.label}</span>
                </div>
              </Button>
            ))}
          </div>
          <Button onClick={handleLogMood} disabled={selectedMood === null} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            Log Mood
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">Mood Trends (Last 7 Days)</CardTitle>
          <CardDescription>Visualize your mood fluctuations over the past week.</CardDescription>
        </CardHeader>
        <CardContent>
          {moodLog.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={8} className="sm:text-xs" />
                  <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tickFormatter={(value) => moodOptions.find(m=>m.value === value)?.emoji || ''} tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={10} className="sm:text-sm" width={40}/>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        formatter={(value, name, props) => {
                           const moodOption = moodOptions.find(m => m.value === value);
                           return (
                            <div className="flex flex-col">
                              <span className="font-semibold">{props.payload.date}</span>
                              {moodOption ? `${moodOption.label} ${moodOption.emoji}` : 'No data'}
                            </div>
                           )
                        }}
                        indicator="line" 
                        hideLabel 
                      />}
                  />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--primary))" }} activeDot={{ r: 7 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No mood data logged yet. Start logging your mood to see trends!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}