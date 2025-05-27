
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
  // Optional: Could add investmentHorizon: z.string().describe('e.g., Short-term (1-3 years), Medium-term (3-7 years), Long-term (7+ years)')
});
export type PortfolioSuggestionInput = z.infer<typeof PortfolioSuggestionInputSchema>;

const AssetAllocationSchema = z.object({
    assetClass: z.string().describe("e.g., US Large Cap Stocks, International Developed Stocks, Emerging Market Stocks, US Investment Grade Bonds, High-Yield Bonds, Real Estate (REITs), Commodities, Cash/Money Market. Avoid overly niche or extremely speculative assets unless risk tolerance is 'High' and clearly justified."),
    percentage: z.number().min(0).max(100).describe("Percentage of total investment allocated to this asset class. Sum of percentages for all asset classes should be 100."),
    rationale: z.string().describe("Brief rationale for including this asset class and its percentage, considering recent trends (based on your general knowledge up to your last training) and the investor's risk tolerance.")
});

const PortfolioSuggestionOutputSchema = z.object({
  portfolioAllocation: z.array(AssetAllocationSchema)
    .describe("Suggested asset allocation breakdown. Aim for 3-7 asset classes for diversification. Ensure the sum of percentages is 100."),
  projectedReturnRange: z.object({
    low: z.number().describe("Lower end of the plausible projected annual return percentage for this portfolio, given the risk tolerance and current general market understanding. This is an estimate, not a guarantee."),
    high: z.number().describe("Higher end of the plausible projected annual return percentage for this portfolio. This is an estimate, not a guarantee.")
  }).describe("An estimated range for the potential annual return. Be realistic and conservative, especially for lower risk tolerances."),
  riskAnalysis: z.string().describe("Analysis of the portfolio's overall risk level in relation to the suggested allocation and selected risk tolerance. Discuss potential downsides or volatility."),
  strategyCommentary: z.string().describe("General commentary on the investment strategy, market conditions considered (based on your general knowledge up to your last training data cut-off), and how it aligns with the investor's inputs. Mention that this strategy assumes a medium to long-term investment horizon unless specified otherwise."),
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
  prompt: `You are an expert AI financial planning assistant. Your task is to generate a diversified investment portfolio suggestion based on the user's investment amount and risk tolerance.

Investment Amount: \${{{investmentAmount}}}
Risk Tolerance: {{{riskTolerance}}}

Instructions:
1.  **Portfolio Allocation:**
    *   Suggest a diversified portfolio across 3-7 broad asset classes (e.g., US Large Cap Stocks, International Developed Stocks, Emerging Market Stocks, US Investment Grade Bonds, High-Yield Bonds, Real Estate (REITs), Commodities, Cash/Money Market).
    *   The sum of allocation percentages MUST be 100%.
    *   For each asset class, provide its percentage allocation and a brief rationale. The rationale should connect to the user's risk tolerance and your general understanding of recent market trends (up to your last training data).
    *   Adjust aggressiveness based on risk tolerance:
        *   Low Risk: Higher allocation to bonds, cash/money market. Lower allocation to equities, especially emerging markets or high-yield bonds.
        *   Medium Risk: Balanced allocation between equities and fixed income. Moderate exposure to growth assets.
        *   High Risk: Higher allocation to equities, including emerging markets or thematic investments (like tech-focused ETFs if appropriate). Lower allocation to traditional bonds. May include a small, clearly justified allocation to more volatile assets like cryptocurrencies if risk is 'High' and rationale is very strong.
2.  **Projected Return Range:**
    *   Provide a realistic and plausible *annual* return percentage range (low and high end) for the suggested portfolio.
    *   This range should be an estimate based on historical performance of such asset mixes and general market expectations, adjusted for the specified risk tolerance. Emphasize this is not a guarantee.
3.  **Risk Analysis:**
    *   Describe the overall risk profile of the suggested portfolio.
    *   Mention potential downsides, volatility, and what kind of market conditions might negatively impact this portfolio.
4.  **Strategy Commentary:**
    *   Provide general commentary on the strategy. Explain how it aligns with the user's inputs.
    *   Briefly mention the types of general market trends or economic conditions (based on your training data) that influenced your allocation choices. State that your knowledge of "recent trends" is based on your last training data.
    *   Assume a medium to long-term investment horizon (e.g., 5+ years) unless the user specifies otherwise (note: current input schema does not include horizon).
5.  **Disclaimer:**
    *   CRITICAL: Ensure the 'importantDisclaimer' field is populated with the standard disclaimer provided in the schema.

Output Format:
Strictly adhere to the JSON schema provided for 'PortfolioSuggestionOutputSchema'. Ensure all percentages sum to 100. Ensure rationale is provided for each asset class.
The 'importantDisclaimer' field MUST be included and accurate.
Example Asset Classes (not exhaustive, choose appropriately):
- US Large Cap Stocks (e.g., S&P 500 tracking ETF)
- US Small Cap Stocks
- International Developed Market Stocks
- Emerging Market Stocks
- US Investment Grade Bonds (Corporate & Government)
- High-Yield Corporate Bonds
- International Bonds
- Real Estate (REITs)
- Commodities (e.g., broad commodity index ETF)
- Cash / Money Market Funds
- (If High Risk & justified): A small allocation to specific sectors like Technology ETFs or diversified Crypto ETPs.

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
        // Optionally, try to normalize or throw a more specific error. For now, let it pass but log.
        // throw new Error(`AI generated portfolio allocation sums to ${totalPercentage.toFixed(1)}% instead of 100%. Please try again.`);
    }
    if(!output.importantDisclaimer || !output.importantDisclaimer.includes("NOT financial advice")) {
        throw new Error("AI response is missing the critical financial advice disclaimer.");
    }
    return output;
  }
);
