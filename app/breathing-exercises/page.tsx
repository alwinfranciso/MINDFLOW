"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageTitle from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import BreathingAnimation from '@/components/breathing-animation';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BreathingStep {
  name: 'Inhale' | 'Hold' | 'Exhale' | 'Pause';
  duration: number; 
}

interface BreathingExercise {
  id: string;
  title: string;
  description:string;
  totalDurationMinutes: number; 
  steps: BreathingStep[];
}

const exercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'A simple technique to calm your nervous system and reduce stress by focusing on steady, even breaths.',
    totalDurationMinutes: 2,
    steps: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Pause', duration: 4 },
    ],
  },
  {
    id: '478-breathing',
    title: '4-7-8 Breathing',
    description: 'Known as "relaxing breath," this technique can help with anxiety and sleep.',
    totalDurationMinutes: 1,
    steps: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
  },
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing',
    description: 'Focus on the natural rhythm of your breath to bring calmness and awareness.',
    totalDurationMinutes: 5,
    steps: [ 
      { name: 'Inhale', duration: 5 },
      { name: 'Exhale', duration: 5 },
    ],
  },
];

export default function BreathingExercisesPage() {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(exercises[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeftInStep, setTimeLeftInStep] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause' | 'idle'>('idle');
  const [animationText, setAnimationText] = useState('Ready?');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (isVoiceEnabled && synthRef.current && text) {
      synthRef.current.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      synthRef.current.speak(utterance);
    }
  }, [isVoiceEnabled]);

  const currentStep = selectedExercise.steps[currentStepIndex];
  const totalSessionDurationSeconds = selectedExercise.totalDurationMinutes * 60;

  const resetExercise = useCallback((speakReset = true) => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsRunning(false);
    setCurrentStepIndex(0);
    setTimeLeftInStep(selectedExercise.steps[0].duration);
    setTotalTimeElapsed(0);
    setAnimationPhase('idle');
    setAnimationText('Ready?');
    if (speakReset) {
       speak('Exercise reset');
    }
  }, [selectedExercise, speak]);

  useEffect(() => {
    resetExercise(false); 
  }, [selectedExercise, resetExercise]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentStep) {
      if (timeLeftInStep === currentStep.duration) {
        speak(currentStep.name);
      }
      setAnimationPhase(currentStep.name.toLowerCase() as any);
      setAnimationText(`${currentStep.name} (${timeLeftInStep}s)`);

      if (timeLeftInStep > 0) {
        timer = setTimeout(() => {
          setTimeLeftInStep(prev => prev - 1);
          setTotalTimeElapsed(prev => prev + 1);
        }, 1000);
      } else {
        if (totalTimeElapsed >= totalSessionDurationSeconds) {
          setIsRunning(false);
          setAnimationPhase('idle');
          setAnimationText('Session Complete!');
          speak('Session Complete!');
        } else {
          const nextStepIndex = (currentStepIndex + 1) % selectedExercise.steps.length;
          setCurrentStepIndex(nextStepIndex);
          setTimeLeftInStep(selectedExercise.steps[nextStepIndex].duration);
        }
      }
    } else if (!isRunning && totalTimeElapsed > 0 && totalTimeElapsed < totalSessionDurationSeconds) {
        if (animationText !== 'Paused') { 
          setAnimationText('Paused');
          speak('Paused');
        }
    } else if (!isRunning && totalTimeElapsed === 0 && animationText !== 'Ready?') {
        setAnimationText('Ready?'); 
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isRunning, timeLeftInStep, currentStepIndex, selectedExercise, totalTimeElapsed, totalSessionDurationSeconds, currentStep, speak, animationText]);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleStartPause = useCallback(() => {
    if (totalTimeElapsed >= totalSessionDurationSeconds) {
      resetExercise(false); 
      setTimeout(() => {
        setTimeLeftInStep(selectedExercise.steps[0].duration);
        setIsRunning(true);
      }, 0);
    } else {
      const newIsRunning = !isRunning;
      setIsRunning(newIsRunning);
      if (newIsRunning) { 
        if (timeLeftInStep === 0 && currentStepIndex === 0 && totalTimeElapsed === 0) { 
           setTimeLeftInStep(selectedExercise.steps[0].duration);
        }
      }
    }
  }, [isRunning, totalTimeElapsed, totalSessionDurationSeconds, resetExercise, selectedExercise, timeLeftInStep, currentStepIndex]);
  
  const handleExerciseChange = useCallback((exerciseId: string) => {
    const newExercise = exercises.find(ex => ex.id === exerciseId);
    if (newExercise) {
      setSelectedExercise(newExercise);
    }
  }, []);

  const progressPercentage = totalSessionDurationSeconds > 0 ? (totalTimeElapsed / totalSessionDurationSeconds) * 100 : 0;

  return (
    <div className="space-y-8">
      <PageTitle
        title="Breathing Exercises"
        description="Practice guided breathing techniques to find calm and focus."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-headline text-primary flex items-center">
              <Leaf className="mr-2 h-6 w-6" />
              <span>{selectedExercise.title}</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={selectedExercise.id} onValueChange={handleExerciseChange}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background">
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map(ex => (
                    <SelectItem value={ex.id} key={ex.id}>{ex.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 p-2 rounded-md border bg-background sm:w-auto justify-center">
                <Label htmlFor="voice-toggle" className="flex items-center cursor-pointer">
                  {isVoiceEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                  <span className="ml-2 text-sm text-foreground/80">Voice Guide</span>
                </Label>
                <Switch
                  id="voice-toggle"
                  checked={isVoiceEnabled}
                  onCheckedChange={setIsVoiceEnabled}
                  aria-label="Toggle voice assistant"
                />
              </div>
            </div>
          </div>
          <CardDescription className="pt-2">{selectedExercise.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-8">
          <BreathingAnimation 
            phase={animationPhase} 
            duration={currentStep ? currentStep.duration : 1} 
            text={animationText} 
          />
          <div className="w-full max-w-md space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Time Elapsed: {formatTime(totalTimeElapsed)}</span>
              <span>Total Duration: {formatTime(totalSessionDurationSeconds)}</span>
            </div>
            <Progress value={progressPercentage} aria-label={`Exercise progress: ${progressPercentage.toFixed(0)}%`} className="h-3 [&>div]:bg-accent" />
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleStartPause} variant="outline" size="lg" className="text-accent border-accent hover:bg-accent/10 hover:text-accent">
              {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isRunning ? 'Pause' : (totalTimeElapsed > 0 && totalTimeElapsed < totalSessionDurationSeconds ? 'Resume' : 'Start')}
            </Button>
            <Button onClick={() => resetExercise()} variant="outline" size="lg" className="text-primary border-primary hover:bg-primary/10 hover:text-primary">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}