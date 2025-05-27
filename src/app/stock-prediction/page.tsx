'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, TrendingUp, AlertCircle } from 'lucide-react';

import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

import type { StockPredictionInput, StockPredictionOutput } from '@/ai/flows/stock-prediction';
import { handleStockPrediction } from './actions';

// Client-side validation schema
const formSchema = z.object({
  tickerSymbol: z.string().min(1, "Ticker symbol is required.").max(10, "Ticker symbol is too long (e.g. AAPL)."),
  optionType: z.enum(['call', 'put'], { required_error: "Option type is required."}),
  strikePrice: z.coerce.number({invalid_type_error: "Strike price must be a number."}).positive("Strike price must be positive."),
  expiryDate: z.date({ required_error: "Expiry date is required."}),
  currentPrice: z.coerce.number({invalid_type_error: "Current price must be a number."}).positive("Current price must be positive."),
  volatility: z.coerce.number({invalid_type_error: "Volatility must be a number."}).min(0, "Volatility cannot be negative.").max(2, "Volatility (e.g., 0.3 for 30%) should be realistic."),
  riskFreeRate: z.coerce.number({invalid_type_error: "Risk-free rate must be a number."}).min(0, "Risk-free rate cannot be negative.").max(1, "Risk-free rate (e.g., 0.05 for 5%) should be realistic."),
  timeToExpiry: z.coerce.number({invalid_type_error: "Time to expiry must be a number."}).positive("Time to expiry (in years) must be positive."),
});

type FormValues = z.infer<typeof formSchema>;

export default function StockPredictionPage() {
  const [predictionResult, setPredictionResult] = useState<StockPredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tickerSymbol: '',
      optionType: undefined, // So placeholder shows
      strikePrice: undefined,
      expiryDate: undefined,
      currentPrice: undefined,
      volatility: undefined,
      riskFreeRate: undefined,
      timeToExpiry: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    const inputForAI: StockPredictionInput = {
      ...data,
      expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
    };

    const result = await handleStockPrediction(inputForAI);

    setIsLoading(false);
    if (result.success && result.data) {
      setPredictionResult(result.data);
      toast({
        title: "Prediction Successful",
        description: "Stock price prediction has been generated.",
      });
    } else {
      setError(result.error || "An unknown error occurred.");
      if (result.fieldErrors) {
        // Optionally set field errors using form.setError
        Object.entries(result.fieldErrors).forEach(([field, fieldError]) => {
          if (field !== "_errors" && fieldError?._errors?.[0]) {
             form.setError(field as keyof FormValues, { type: 'server', message: fieldError._errors[0] });
          }
        });
      }
      toast({
        title: "Prediction Failed",
        description: result.error || "Could not generate prediction.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-12">
      <PageTitle
        title="Algorithmic Stock Prediction"
        subtitle="Enter stock option details to get an AI-powered future price prediction."
      />

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Prediction Input</CardTitle>
          <CardDescription>Fill in the details below to generate a prediction.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tickerSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticker Symbol (e.g., AAPL)</FormLabel>
                      <FormControl>
                        <Input placeholder="AAPL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="optionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="put">Put</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="strikePrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Strike Price ($)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="150" {...field} step="0.01" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="currentPrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Current Stock Price ($)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="145.50" {...field} step="0.01" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="volatility"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Volatility (e.g., 0.3 for 30%)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.3" {...field} step="0.01" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="riskFreeRate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Risk-Free Rate (e.g., 0.02 for 2%)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.02" {...field} step="0.001" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="timeToExpiry"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Time to Expiry (Years)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.25" {...field} step="0.01" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Prediction...
                  </>
                ) : (
                  "Get Prediction"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {predictionResult && (
        <Card className="max-w-2xl mx-auto shadow-xl mt-12 animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-primary">
              <TrendingUp className="h-6 w-6" />
              Prediction Result
            </CardTitle>
            <CardDescription>AI-generated stock price prediction and analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Predicted Stock Price</Label>
              <p className="text-3xl font-bold text-accent">
                ${predictionResult.predictedPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Analysis</Label>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {predictionResult.analysis}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
