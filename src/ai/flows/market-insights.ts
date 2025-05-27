'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven market insights.
 *
 * - getMarketInsights - A function that retrieves AI-driven insights based on market indicators.
 * - MarketInsightsInput - The input type for the getMarketInsights function.
 * - MarketInsightsOutput - The return type for the getMarketInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketInsightsInputSchema = z.object({
  marketIndicators: z
    .string()
    .describe('Current market indicators to analyze, such as interest rates, inflation, and unemployment.'),
  pastStockData: z.string().describe('Historical stock data to use for analysis.'),
});
export type MarketInsightsInput = z.infer<typeof MarketInsightsInputSchema>;

const MarketInsightsOutputSchema = z.object({
  summary: z.string().describe('A balanced overview of the current market sentiment, integrating both positive and negative signals from the provided data.'),
  factors: z.string().describe('Key 3-5 driving factors (e.g., economic, political, technological, sector-specific) influencing stock prices and options, each with a brief explanation of its impact.'),
  risks: z.string().describe('Potential risks and uncertainties, categorized if possible (e.g., macroeconomic, geopolitical, industry-specific) with their potential impact, including any visible negative trends or warning signs. Also includes a concluding disclaimer about the AI-generated nature of these insights.'),
});
export type MarketInsightsOutput = z.infer<typeof MarketInsightsOutputSchema>;

export async function getMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput> {
  return marketInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketInsightsPrompt',
  input: {schema: MarketInsightsInputSchema},
  output: {schema: MarketInsightsOutputSchema},
  prompt: `You are an expert financial analyst. Your task is to provide comprehensive market insights based on the following information. Structure your response clearly based on the output schema descriptions.

Market Indicators:
{{{marketIndicators}}}

Past Stock Data/Trends:
{{{pastStockData}}}

Please provide the following, ensuring your output strictly adheres to the descriptions for 'summary', 'factors', and 'risks':

1.  **For 'summary':** A balanced overview of the current market sentiment, integrating both positive and negative signals from the provided data.
2.  **For 'factors':** Identify 3-5 key driving factors (e.g., economic, political, technological, sector-specific) influencing stock prices and options. For each factor, provide a brief explanation of its impact.
3.  **For 'risks':** Outline potential risks and uncertainties. Categorize them if possible (e.g., macroeconomic, geopolitical, industry-specific) and briefly describe their potential impact. Include any visible negative trends or warning signs. Conclude this 'risks' section with: "Disclaimer: These insights are AI-generated, for informational purposes only, and do not constitute financial advice."

Ensure your analysis is objective and data-driven, drawing directly from the provided indicators and stock data.
  `,
});

const marketInsightsFlow = ai.defineFlow(
  {
    name: 'marketInsightsFlow',
    inputSchema: MarketInsightsInputSchema,
    outputSchema: MarketInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
