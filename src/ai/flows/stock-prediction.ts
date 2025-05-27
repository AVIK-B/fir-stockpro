// StockPro Analytics Stock Prediction Flow
'use server';
/**
 * @fileOverview Predicts future stock prices based on various algorithmic analyses.
 *
 * - predictStockPrice - A function that handles the stock price prediction process.
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
  predictedPrice: z.number().describe('The predicted future stock price.'),
  analysis: z.string().describe('A brief analysis of the prediction.'),
});
export type StockPredictionOutput = z.infer<typeof StockPredictionOutputSchema>;

export async function predictStockPrice(input: StockPredictionInput): Promise<StockPredictionOutput> {
  return stockPredictionFlow(input);
}

const stockPredictionPrompt = ai.definePrompt({
  name: 'stockPredictionPrompt',
  input: {schema: StockPredictionInputSchema},
  output: {schema: StockPredictionOutputSchema},
  prompt: `You are a financial analyst specializing in stock option pricing.
  Given the following information, predict the future stock price:

  Ticker Symbol: {{{tickerSymbol}}}
  Option Type: {{{optionType}}}
  Strike Price: {{{strikePrice}}}
  Expiry Date: {{{expiryDate}}}
  Current Price: {{{currentPrice}}}
  Volatility: {{{volatility}}}
  Risk-Free Rate: {{{riskFreeRate}}}
  Time to Expiry: {{{timeToExpiry}}}

  Provide a predicted future stock price and a brief analysis.
`,
});

const stockPredictionFlow = ai.defineFlow(
  {
    name: 'stockPredictionFlow',
    inputSchema: StockPredictionInputSchema,
    outputSchema: StockPredictionOutputSchema,
  },
  async input => {
    const {output} = await stockPredictionPrompt(input);
    return output!;
  }
);
