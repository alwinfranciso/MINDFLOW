// src/ai/flows/suggest-technique.ts
'use server';

/**
 * @fileOverview AI flow to suggest techniques for managing negative feelings.
 *
 * - suggestTechnique - A function that suggests a technique to manage negative feelings.
 * - SuggestTechniqueInput - The input type for the suggestTechnique function.
 * - SuggestTechniqueOutput - The return type for the suggestTechnique function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTechniqueInputSchema = z.object({
  feeling: z
    .string()
    .describe('The negative feeling the user is experiencing.'),
  intensity: z.string().describe('The intensity of the feeling (e.g., mild, moderate, severe).'),
});
export type SuggestTechniqueInput = z.infer<typeof SuggestTechniqueInputSchema>;

const SuggestTechniqueOutputSchema = z.object({
  technique: z.string().describe('A suggested technique to manage the negative feeling.'),
  reason: z.string().describe('A brief explanation of why the technique is helpful for this feeling.'),
});
export type SuggestTechniqueOutput = z.infer<typeof SuggestTechniqueOutputSchema>;

export async function suggestTechnique(input: SuggestTechniqueInput): Promise<SuggestTechniqueOutput> {
  return suggestTechniqueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTechniquePrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Updated model specification
  input: {schema: SuggestTechniqueInputSchema},
  output: {schema: SuggestTechniqueOutputSchema},
  prompt: `You are a mental health expert. A user is experiencing a negative feeling, and you will suggest a technique to manage it.

Feeling: {{{feeling}}}
Intensity: {{{intensity}}}

Suggest a technique and explain why it is helpful for this feeling.  The suggestion should be very simple, and immediately actionable.

Technique:`,
});

const suggestTechniqueFlow = ai.defineFlow(
  {
    name: 'suggestTechniqueFlow',
    inputSchema: SuggestTechniqueInputSchema,
    outputSchema: SuggestTechniqueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
