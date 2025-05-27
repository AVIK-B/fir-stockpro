
'use server';
import { suggestPortfolio, type PortfolioSuggestionInput, type PortfolioSuggestionOutput } from '@/ai/flows/portfolio-suggestion-flow';
import { z } from 'zod';

const PortfolioCalculatorServerInputSchema = z.object({
  investmentAmount: z.coerce.number({invalid_type_error: "Investment amount must be a number."}).positive("Investment amount must be a positive number."),
  riskTolerance: z.enum(['Low', 'Medium', 'High'], { required_error: "Risk tolerance is required."}),
});

export async function handlePortfolioSuggestion(
  data: PortfolioSuggestionInput
): Promise<{ success: boolean; data?: PortfolioSuggestionOutput; error?: string; fieldErrors?: z.ZodFormattedError<PortfolioSuggestionInput> }> {
  const validatedFields = PortfolioCalculatorServerInputSchema.safeParse(data);

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: "Invalid input. Please check the fields.",
      fieldErrors: validatedFields.error.format() 
    };
  }

  try {
    const result = await suggestPortfolio(validatedFields.data as PortfolioSuggestionInput);
    return { success: true, data: result };
  } catch (error) {
    console.error("Portfolio suggestion error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred generating the portfolio suggestion.";
    return { success: false, error: `Failed to get portfolio suggestion: ${errorMessage}` };
  }
}
