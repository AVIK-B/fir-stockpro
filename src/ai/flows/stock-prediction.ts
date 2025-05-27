
// StockPro Analytics Stock Valuation Flow
'use server';
/**
 * @fileOverview Estimates future stock valuations based on various algorithmic analyses.
 *
 * - predictStockPrice - A function that handles the stock valuation process.
 * - StockPredictionInput - The input type for the predictStockPrice function.
 * - StockPredictionOutput - The return type for the predictStockPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockPredictionInputSchema = z.object({
  tickerSymbol: z.string().describe('The ticker symbol of the stock.'),
  optionType: z.enum(['call', 'put']).describe('The type of option (call or put).'),
  strikePrice: z.number().describe('The strike price of the option.'),
  expiryDate: z.string().describe('The expiry date of the option (YYYY-MM-DD).'),
  currentPrice: z.number().describe('The current price of the stock.'),
  volatility: z.number().describe('The volatility of the stock.'),
  riskFreeRate: z.number().describe('The risk-free interest rate.'),
  timeToExpiry: z.number().describe('Time to expiration in years.'),
});
export type StockPredictionInput = z.infer<typeof StockPredictionInputSchema>;

const StockPredictionOutputSchema = z.object({
  predictedPrice: z.number().describe('The estimated future stock valuation.'),
  analysis: z.string().describe('A brief analysis of the valuation, explaining the methodology.'),
});
export type StockPredictionOutput = z.infer<typeof StockPredictionOutputSchema>;

// Note: Function name `predictStockPrice` is kept for internal consistency to avoid breaking changes with how it's called.
// The user-facing text and prompt semantics have been updated to "valuation".
export async function predictStockPrice(input: StockPredictionInput): Promise<StockPredictionOutput> {
  return stockPredictionFlow(input);
}

const stockPredictionPrompt = ai.definePrompt({
  name: 'stockValuationPrompt', // Updated name
  input: {schema: StockPredictionInputSchema},
  output: {schema: StockPredictionOutputSchema},
  prompt: `You are a financial analyst specializing in stock option valuation.
Given the following information, estimate the future stock valuation:

Ticker Symbol: {{{tickerSymbol}}}
Option Type: {{{optionType}}}
Strike Price: {{{strikePrice}}}
Expiry Date: {{{expiryDate}}}
Current Price: {{{currentPrice}}}
Volatility: {{{volatility}}}
Risk-Free Rate: {{{riskFreeRate}}}
Time to Expiry: {{{timeToExpiry}}}

Provide an estimated future stock valuation.

For the 'analysis' field, explain that the valuation is derived from a sophisticated AI model that synthesizes information by considering principles from various analytical approaches. This includes:
-   Time-Series Analysis: Incorporating patterns and trends from historical data (if available/implied by context) to inform valuation.
-   Volatility Modeling: Assessing risk and potential price swings based on the provided volatility, which impacts the valuation.
-   Option Pricing Factors: Considering how factors like strike price, time to expiry, and risk-free rate influence option valuation and implied future stock valuations, drawing from established financial theories.
-   Market Context: The AI also factors in the broader market information provided (current price, ticker symbol representing a specific company/sector) for a comprehensive valuation.
The final valuation is a result of this multi-faceted analysis. Conclude the analysis by emphasizing that this is an AI-generated estimation and not financial advice.
`,
});

const stockPredictionFlow = ai.defineFlow(
  {
    name: 'stockValuationFlow', // Updated name
    inputSchema: StockPredictionInputSchema,
    outputSchema: StockPredictionOutputSchema,
  },
  async input => {
    const {output} = await stockPredictionPrompt(input);
    return output!;
  }
);
