'use server';
import { predictStockPrice, type StockPredictionInput, type StockPredictionOutput } from '@/ai/flows/stock-prediction';
import { z } from 'zod';

// This schema should match or be compatible with StockPredictionInput from the AI flow
const StockPredictionServerInputSchema = z.object({
  tickerSymbol: z.string().min(1, "Ticker symbol is required.").max(10, "Ticker symbol is too long."),
  optionType: z.enum(['call', 'put'], { required_error: "Option type is required."}),
  strikePrice: z.coerce.number({invalid_type_error: "Strike price must be a number."}).positive("Strike price must be positive."),
  expiryDate: z.string().min(1, "Expiry date is required."), // Validated as YYYY-MM-DD on client
  currentPrice: z.coerce.number({invalid_type_error: "Current price must be a number."}).positive("Current price must be positive."),
  volatility: z.coerce.number({invalid_type_error: "Volatility must be a number."}).min(0, "Volatility cannot be negative.").max(2, "Volatility seems too high (e.g., 0.3 for 30%)."), // Allow up to 200%
  riskFreeRate: z.coerce.number({invalid_type_error: "Risk-free rate must be a number."}).min(0, "Risk-free rate cannot be negative.").max(1, "Risk-free rate seems too high (e.g., 0.05 for 5%)."),
  timeToExpiry: z.coerce.number({invalid_type_error: "Time to expiry must be a number."}).positive("Time to expiry must be positive (in years)."),
});

export async function handleStockPrediction(
  data: StockPredictionInput
): Promise<{ success: boolean; data?: StockPredictionOutput; error?: string; fieldErrors?: z.ZodFormattedError<StockPredictionInput> }> {
  const validatedFields = StockPredictionServerInputSchema.safeParse(data);

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: "Invalid input. Please check the fields.",
      fieldErrors: validatedFields.error.format() 
    };
  }

  try {
    // Ensure the data passed to predictStockPrice matches its expected StockPredictionInput type
    const result = await predictStockPrice(validatedFields.data as StockPredictionInput);
    return { success: true, data: result };
  } catch (error) {
    console.error("Stock prediction error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to get stock prediction: ${errorMessage}` };
  }
}
