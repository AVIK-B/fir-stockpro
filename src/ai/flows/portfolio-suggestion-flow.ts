
'use server';
/**
 * @fileOverview Provides AI-driven portfolio suggestions.
 *
 * - suggestPortfolio - A function that generates portfolio suggestions.
 * - PortfolioSuggestionInput - The input type for the suggestPortfolio function.
 * - PortfolioSuggestionOutput - The return type for the suggestPortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioSuggestionInputSchema = z.object({
  investmentAmount: z.number().positive().describe('The total amount of USD to invest.'),
  riskTolerance: z.enum(['Low', 'Medium', 'High']).describe('The investor\'s risk tolerance level.'),
  targetAnnualReturn: z.number().positive().describe('The desired target annual return percentage (e.g., 8 for 8%). The AI will try to construct a portfolio aiming for this return, balanced with the risk tolerance.').optional(),
});
export type PortfolioSuggestionInput = z.infer<typeof PortfolioSuggestionInputSchema>;

const AssetAllocationSchema = z.object({
    assetClass: z.string().describe("e.g., US Large Cap Stocks, International Developed Stocks, Emerging Market Stocks, US Investment Grade Bonds, High-Yield Bonds, Real Estate (REITs), Commodities, Cash/Money Market. Avoid overly niche or extremely speculative assets unless risk tolerance is 'High' and clearly justified."),
    percentage: z.number().min(0).max(100).describe("Percentage of total investment allocated to this asset class. Sum of percentages for all asset classes should be 100."),
    rationale: z.string().describe("Brief rationale for including this asset class and its percentage, considering recent trends (based on your general knowledge up to your last training), the investor's risk tolerance, and the target annual return if provided.")
});

const PortfolioSuggestionOutputSchema = z.object({
  portfolioAllocation: z.array(AssetAllocationSchema)
    .describe("Suggested asset allocation breakdown. Aim for 3-7 asset classes for diversification. Ensure the sum of percentages is 100."),
  projectedReturnRange: z.object({
    low: z.number().describe("Lower end of the plausible projected annual return percentage for this portfolio, given the risk tolerance, target return, and current general market understanding. This is an estimate, not a guarantee."),
    high: z.number().describe("Higher end of the plausible projected annual return percentage for this portfolio. This is an estimate, not a guarantee.")
  }).describe("An estimated range for the potential annual return. Be realistic and conservative, especially for lower risk tolerances. If a target return was specified, comment on its feasibility within this range."),
  riskAnalysis: z.string().describe("Analysis of the portfolio's overall risk level in relation to the suggested allocation, selected risk tolerance, and target annual return. Discuss potential downsides or volatility."),
  strategyCommentary: z.string().describe("General commentary on the investment strategy, market conditions considered (based on your general knowledge up to your last training data cut-off), and how it aligns with the investor's inputs (risk tolerance and target annual return). Mention that this strategy assumes a medium to long-term investment horizon unless specified otherwise."),
  importantDisclaimer: z.string().default("IMPORTANT: This is an AI-generated portfolio suggestion for informational and educational purposes only. It is NOT financial advice. All investments carry risk, and past performance does not guarantee future results. Market conditions are dynamic. Consult with a qualified financial advisor before making any investment decisions.")
    .describe("Mandatory disclaimer about the nature of AI suggestions and the need for professional advice.")
});
export type PortfolioSuggestionOutput = z.infer<typeof PortfolioSuggestionOutputSchema>;

export async function suggestPortfolio(input: PortfolioSuggestionInput): Promise<PortfolioSuggestionOutput> {
  return portfolioSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'portfolioSuggestionPrompt',
  input: {schema: PortfolioSuggestionInputSchema},
  output: {schema: PortfolioSuggestionOutputSchema},
  prompt: `You are an expert AI financial planning assistant. Your task is to generate a diversified investment portfolio suggestion based on the user's investment amount, risk tolerance, and optionally, their target annual return.

Investment Amount: \${{{investmentAmount}}}
Risk Tolerance: {{{riskTolerance}}}
{{#if targetAnnualReturn}}Target Annual Return: {{{targetAnnualReturn}}}%{{/if}}

Instructions:
1.  **Portfolio Allocation:**
    *   Suggest a diversified portfolio across 3-7 broad asset classes (e.g., US Large Cap Stocks, International Developed Stocks, Emerging Market Stocks, US Investment Grade Bonds, High-Yield Bonds, Real Estate (REITs), Commodities, Cash/Money Market).
    *   The sum of allocation percentages MUST be 100%.
    *   For each asset class, provide its percentage allocation and a brief rationale. The rationale should connect to the user's risk tolerance, your general understanding of recent market trends (up to your last training data), and the target annual return if specified.
    *   Adjust aggressiveness based on risk tolerance and target return:
        *   Low Risk: Higher allocation to bonds, cash/money market. Lower allocation to equities. If target return is high for this risk level, state that it might be challenging to achieve without taking on more risk than indicated.
        *   Medium Risk: Balanced allocation. If target return is specified, tilt towards assets that might help achieve it while staying within medium risk.
        *   High Risk: Higher allocation to equities. If target return is high, allocation may be more aggressive but still diversified. If target is very high, state if it's exceptionally speculative.
2.  **Projected Return Range:**
    *   Provide a realistic and plausible *annual* return percentage range (low and high end) for the suggested portfolio.
    *   This range should be an estimate based on historical performance of such asset mixes and general market expectations, adjusted for the specified risk tolerance and target annual return.
    *   If a target annual return was provided, explicitly comment on how the projected range relates to the target (e.g., "This range aligns with your target," or "Achieving your target of X% consistently might be challenging with this risk profile, but this portfolio aims towards it.").
    *   Emphasize this is not a guarantee.
3.  **Risk Analysis:**
    *   Describe the overall risk profile of the suggested portfolio, considering the risk tolerance and target return.
    *   Mention potential downsides, volatility, and what kind of market conditions might negatively impact this portfolio.
4.  **Strategy Commentary:**
    *   Provide general commentary on the strategy. Explain how it aligns with the user's inputs (risk tolerance and target return).
    *   If a target return was specified, discuss the strategy's approach to trying to meet it, and its feasibility given the risk tolerance.
    *   Briefly mention the types of general market trends or economic conditions (based on your training data) that influenced your allocation choices. State that your knowledge of "recent trends" is based on your last training data.
    *   Assume a medium to long-term investment horizon (e.g., 5+ years).
5.  **Disclaimer:**
    *   CRITICAL: Ensure the 'importantDisclaimer' field is populated with the standard disclaimer provided in the schema.

Output Format:
You MUST strictly adhere to the JSON schema provided for 'PortfolioSuggestionOutputSchema'. Ensure all percentages sum to 100, rationale is provided for each asset class, and the 'importantDisclaimer' field is accurately populated.

Generate the portfolio suggestion now.
`,
});

const portfolioSuggestionFlow = ai.defineFlow(
  {
    name: 'portfolioSuggestionFlow',
    inputSchema: PortfolioSuggestionInputSchema,
    outputSchema: PortfolioSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return any portfolio suggestion. Please try again or adjust your inputs.");
    }
    if (!output.portfolioAllocation || output.portfolioAllocation.length === 0) {
        throw new Error("AI failed to generate a portfolio allocation. Please check your input values.");
    }
    const totalPercentage = output.portfolioAllocation.reduce((sum, asset) => sum + asset.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.1) { // Allow for tiny floating point inaccuracies
        console.warn("AI generated portfolio allocation does not sum to 100%", totalPercentage);
        // This could be upgraded to an error if strict adherence is critical for display.
        // throw new Error(`AI generated portfolio allocation that sums to ${totalPercentage.toFixed(1)}% instead of 100%. Please try again.`);
    }
    if(!output.importantDisclaimer || !output.importantDisclaimer.includes("NOT financial advice")) {
        throw new Error("AI response is missing the critical financial advice disclaimer. Output cannot be used.");
    }

    if (!output.projectedReturnRange ||
        typeof output.projectedReturnRange.low !== 'number' ||
        typeof output.projectedReturnRange.high !== 'number') {
      throw new Error("AI failed to generate a valid projected return range. Please check your input values or try again.");
    }
    if (output.projectedReturnRange.low > output.projectedReturnRange.high) {
      // This is a strong indicator of faulty AI logic for this specific request.
      console.warn(`AI generated an inverted projected return range: low ${output.projectedReturnRange.low}%, high ${output.projectedReturnRange.high}%.`);
      throw new Error(`AI generated an inconsistent projected return range (low: ${output.projectedReturnRange.low}%, high: ${output.projectedReturnRange.high}%). This might indicate an issue with the AI's reasoning for the given inputs. Please try adjusting your inputs or try again.`);
    }
    
    return output;
  }
);
