'use server';
import { getMarketInsights, type MarketInsightsInput, type MarketInsightsOutput } from '@/ai/flows/market-insights';
import { z } from 'zod';

// This schema should match or be compatible with MarketInsightsInput from the AI flow
const MarketInsightsServerInputSchema = z.object({
  marketIndicators: z.string().min(10, "Market indicators are required and should be descriptive enough for analysis."),
  pastStockData: z.string().min(10, "Past stock data is required and should be descriptive enough for analysis."),
});

export async function handleMarketInsights(
  data: MarketInsightsInput
): Promise<{ success: boolean; data?: MarketInsightsOutput; error?: string; fieldErrors?: z.ZodFormattedError<MarketInsightsInput> }> {
  const validatedFields = MarketInsightsServerInputSchema.safeParse(data);

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: "Invalid input. Please check the fields.",
      fieldErrors: validatedFields.error.format()
    };
  }

  try {
    const result = await getMarketInsights(validatedFields.data as MarketInsightsInput);
    return { success: true, data: result };
  } catch (error) {
    console.error("Market insights error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to get market insights: ${errorMessage}` };
  }
}
