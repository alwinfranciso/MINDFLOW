
import { config } from 'dotenv';
config(); // Load .env variables at the top

import { genkit, type GenkitPlugin } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const genkitPlugins: GenkitPlugin[] = [];

// Always attempt to register the googleAI plugin.
// The plugin itself should handle API key issues at runtime.
genkitPlugins.push(googleAI());

// Always set a default model.
// If the API key is missing, calls to this model will fail via the googleAI plugin.
const configuredModel: string = 'googleai/gemini-1.5-flash-latest';

// Check for the GOOGLE_API_KEY environment variable and warn if missing.
// This warning remains important even if we always register the plugin.
if (!process.env.GOOGLE_API_KEY) {
  console.warn(`
    ****************************************************************************************
    * WARNING: GOOGLE_API_KEY is not set in your .env file.                                *
    * The Google AI plugin for Genkit is being initialized, but AI calls will likely fail  *
    * without a valid API key.                                                             *
    *                                                                                      *
    * Please create or update the .env file in the root of your project and add your       *
    * GOOGLE_API_KEY. For example:                                                         *
    *                                                                                      *
    * GOOGLE_API_KEY=your_actual_api_key_here                                              *
    ****************************************************************************************
  `);
}

export const ai = genkit({
  plugins: genkitPlugins,
  model: configuredModel, // Default model for ai.generate() calls if not specified in the prompt
});

