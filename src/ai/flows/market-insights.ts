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
  summary: z.string().describe('A summary of the market insights based on the provided indicators.'),
  factors: z.string().describe('Key factors influencing stock prices and options.'),
  risks: z.string().describe('Potential risks and uncertainties in the market.'),
});
export type MarketInsightsOutput = z.infer<typeof MarketInsightsOutputSchema>;

export async function getMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput> {
  return marketInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketInsightsPrompt',
  input: {schema: MarketInsightsInputSchema},
  output: {schema: MarketInsightsOutputSchema},
  prompt: `You are an expert financial analyst providing market insights.

  Analyze the provided market indicators and historical stock data to generate a summary of the market, key factors influencing stock prices, and potential risks.

  Market Indicators: {{{marketIndicators}}}
  Past Stock Data: {{{pastStockData}}}

  Provide a concise summary, list the key influencing factors, and outline potential risks in your analysis.
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
