
'use server';
import { suggestPortfolio, type PortfolioSuggestionInput, type PortfolioSuggestionOutput } from '@/ai/flows/portfolio-suggestion-flow';
import { z } from 'zod';

const PortfolioInvestmentSuggestionsServerInputSchema = z.object({
  investmentAmount: z.coerce.number({invalid_type_error: "Investment amount must be a number."}).positive("Investment amount must be a positive number."),
  riskTolerance: z.enum(['Low', 'Medium', 'High'], { required_error: "Risk tolerance is required."}),
  targetAnnualReturn: z.coerce.number({invalid_type_error: "Target return must be a number."}).positive("Target annual return must be a positive percentage.").min(0.1, "Target return should be at least 0.1%.").max(100, "Target return over 100% is highly speculative.").optional(),
});

export async function handlePortfolioSuggestion(
  data: PortfolioSuggestionInput
): Promise<{ success: boolean; data?: PortfolioSuggestionOutput; error?: string; fieldErrors?: z.ZodFormattedError<PortfolioSuggestionInput> }> {
  const validatedFields = PortfolioInvestmentSuggestionsServerInputSchema.safeParse(data);

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

    let displayError = "Failed to generate portfolio suggestion. ";
    if (error instanceof Error && error.message) {
        const knownFlowErrors = [
            "The AI model did not return any portfolio suggestion",
            "AI failed to generate a portfolio allocation",
            "AI response is missing the critical financial advice disclaimer",
            "AI failed to generate a valid projected return range"
        ];

        if (knownFlowErrors.some(knownError => error.message.includes(knownError))) {
            displayError = error.message; 
        } else if (error.message.toLowerCase().includes("zod") || error.message.toLowerCase().includes("schema validation")) {
            displayError += "The AI's response could not be processed due to a formatting issue. This can sometimes happen with complex requests. Please try rephrasing, simplifying your target return, or try again in a moment.";
        } else {
            displayError += "An unexpected issue occurred with the AI model. Please ensure all inputs are reasonable. (Details: " + error.message.substring(0, 150) + ")";
        }
    } else {
        displayError += "An unknown error occurred. Please check your inputs and try again.";
    }
    return { success: false, error: displayError };
  }
}
