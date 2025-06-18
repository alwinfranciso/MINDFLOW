"use client";

import React, { useState, useCallback } from 'react';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Gauge, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { Progress } from "@/components/ui/progress"

interface Question {
  id: string;
  text: string;
}

interface Answer {
  questionId: string;
  value: number; 
}

const questions: Question[] = [
  { id: 'q1', text: 'I feel emotionally drained from my work/studies.' },
  { id: 'q2', text: 'I feel used up at the end of the day.' },
  { id: 'q3', text: 'I feel tired when I get up in the morning and have to face another day.' },
  { id: 'q4', text: 'Working/studying all day is really a strain for me.' },
  { id: 'q5', text: 'I feel burned out from my work/studies.' },
];

const likertOptions = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' },
];

export default function BurnoutBarometerPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    const numericValue = parseInt(value, 10);
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex((a) => a.questionId === questionId);
      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { questionId, value: numericValue };
        return updatedAnswers;
      }
      return [...prevAnswers, { questionId, value: numericValue }];
    });
    setShowResults(false); 
    setScore(null);
  }, []);

  const calculateScore = useCallback(() => {
    if (answers.length < questions.length) {
      alert('Please answer all questions.');
      return;
    }
    const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
    setScore(totalScore);
    setShowResults(true);
  }, [answers]);
  
  const getScoreInterpretation = () => {
    if (score === null) return { level: "", description: "", color: "bg-gray-500", icon: <Activity className="h-8 w-8" /> };
    if (score <= 10) return { level: "Low Burnout", description: "You seem to be managing stress well. Keep up the healthy habits!", color: "bg-green-500", icon: <CheckCircle className="h-8 w-8 text-green-100" /> };
    if (score <= 17) return { level: "Moderate Burnout", description: "You might be experiencing some signs of burnout. Consider exploring stress management techniques.", color: "bg-yellow-500", icon: <AlertTriangle className="h-8 w-8 text-yellow-100" /> };
    return { level: "High Burnout", description: "Your score suggests a high level of burnout. It's important to seek support and make changes to improve your well-being.", color: "bg-red-500", icon: <AlertTriangle className="h-8 w-8 text-red-100" /> };
  };

  const interpretation = getScoreInterpretation();
  const progressValue = score !== null ? (score / 25) * 100 : 0;


  return (
    <div className="space-y-8">
      <PageTitle
        title="Burnout Barometer"
        description="Answer a few simple questions to assess your current burnout level. This is not a diagnostic tool."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <Gauge className="mr-2 h-6 w-6" />
            <span>Burnout Assessment</span>
          </CardTitle>
          <CardDescription>
            Please respond to each statement based on how you've felt over the past few weeks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-lg bg-background/50">
              <p className="font-medium mb-3 text-foreground/90">{index + 1}. {question.text}</p>
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4"
                value={answers.find(a => a.questionId === question.id)?.value.toString()}
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`${question.id}-${option.value}`} className="text-primary focus:ring-primary data-[state=checked]:border-primary" />
                    <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer text-foreground/80 hover:text-foreground">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex-col items-start space-y-4">
          <Button onClick={calculateScore} disabled={answers.length < questions.length} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Calculate My Score
          </Button>
        </CardFooter>
      </Card>

      {showResults && score !== null && (
        <Card className={`shadow-xl border-2 ${interpretation.color.replace('bg-', 'border-')}`}>
          <CardHeader className={`${interpretation.color} text-white rounded-t-lg p-6`}>
            <CardTitle className="text-2xl font-headline flex items-center">
              {interpretation.icon}
              <span className="ml-3">{interpretation.level}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-3xl font-bold text-center text-primary">Your Score: {score} / 25</p>
            <Progress value={progressValue} className={`h-3 [&>div]:${interpretation.color}`} aria-label={`Burnout score: ${score} out of 25`} />
            <p className="text-center text-foreground/90">{interpretation.description}</p>
            <p className="text-sm text-center text-muted-foreground pt-2">
              Remember, this is a simple assessment and not a clinical diagnosis. If you are concerned about burnout, please consult with a healthcare professional or a mental health expert.
            </p>
             <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => { setShowResults(false); setScore(null); setAnswers([]); }} className="text-primary border-primary hover:bg-primary/10">
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}