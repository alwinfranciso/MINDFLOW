"use client";

import PageTitle from '@/components/page-title';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface CBTExercise {
  id: string;
  title: string;
  description: string;
  steps?: string[];
  details: string;
}

const cbtExercises: CBTExercise[] = [
  {
    id: '1',
    title: 'Challenging Negative Thoughts (Thought Record)',
    description: 'Identify and challenge unhelpful automatic negative thoughts.',
    details: 'This technique involves becoming aware of negative thoughts, analyzing the evidence for and against them, and developing more balanced alternative thoughts. It often uses a structured worksheet called a "Thought Record". Key components include: \n1. Situation: Describe the event that led to unpleasant emotions. \n2. Moods: Identify emotions and rate their intensity. \n3. Automatic Thoughts: List the thoughts that came to mind. \n4. Evidence Supporting the Hot Thought: Write down facts that support this thought. \n5. Evidence Against the Hot Thought: Write down facts that contradict this thought. \n6. Alternative/Balanced Thought: Create a new thought that is more realistic and helpful. \n7. Re-rate Moods: Assess how your emotions have changed.',
  },
  {
    id: '2',
    title: 'Behavioral Activation',
    description: 'Increase engagement in positive and rewarding activities.',
    details: 'Behavioral Activation is based on the idea that as people become depressed, they tend to disengage from their routines and withdraw from their environment, which can worsen their symptoms. This technique involves scheduling and participating in activities that the individual once enjoyed or that align with their values, even if they don_t feel like it. The goal is to increase positive reinforcement from the environment, leading to improved mood and functioning.',
  },
  {
    id: '3',
    title: 'Problem-Solving Therapy',
    description: 'Develop skills to effectively manage and solve life problems.',
    details: 'This technique helps individuals define problems clearly, brainstorm potential solutions, evaluate these solutions, choose the most effective one, and then implement and review it. It_s useful for tackling practical problems that contribute to stress and negative emotions.',
  },
  {
    id: '4',
    title: 'Graded Exposure',
    description: 'Gradually confront feared situations or objects to reduce anxiety.',
    details: 'Used primarily for anxiety disorders and phobias, graded exposure involves creating a hierarchy of feared situations, from least to most anxiety-provoking. The individual then systematically exposes themselves to these situations, starting with the least frightening, until their anxiety diminishes through a process called habituation.',
  },
  {
    id: '5',
    title: 'Relaxation Techniques',
    description: 'Learn and practice skills to reduce physiological arousal and stress.',
    details: 'This includes techniques like progressive muscle relaxation (tensing and relaxing different muscle groups), deep breathing exercises (diaphragmatic breathing), and guided imagery (visualizing calming scenes). These help to counteract the body_s stress response.',
  },
];

export default function CBTExercisesPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="CBT Exercises"
        description="Explore a selection of Cognitive Behavioral Therapy techniques to help manage your thoughts, feelings, and behaviors."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <Brain className="mr-2 h-6 w-6" />
            <span>Understanding CBT Techniques</span>
          </CardTitle>
          <CardDescription>
            Cognitive Behavioral Therapy (CBT) is a type of psychotherapy that helps people learn how to identify and change destructive or disturbing thought patterns that have a negative influence on behavior and emotions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {cbtExercises.map((exercise) => (
              <AccordionItem value={exercise.id} key={exercise.id} className="border-border hover:bg-muted/30 transition-colors rounded-md mb-2">
                <AccordionTrigger className="p-4 text-left hover:no-underline text-primary">
                  <span className="font-semibold text-base">{exercise.title}</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <p className="text-sm text-foreground/80 mb-2">{exercise.description}</p>
                  <p className="text-sm text-foreground/90 whitespace-pre-line">{exercise.details}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
