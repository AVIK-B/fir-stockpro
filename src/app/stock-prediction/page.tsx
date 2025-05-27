
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2, TrendingUp, AlertCircle, Info, Archive as ArchiveIcon, Trash2 as Trash2Icon } from 'lucide-react';

import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

import type { StockPredictionInput, StockPredictionOutput } from '@/ai/flows/stock-prediction';
import { handleStockPrediction } from './actions';

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

interface StockValuationHistoryItem {
  id: string;
  timestamp: string;
  input: StockPredictionInput; // Storing AI input which has date as string
  output: StockPredictionOutput; // Output still refers to predictedPrice internally
}

const LOCAL_STORAGE_KEY = 'stockValuationHistory_v1'; // Updated key

export default function StockValuationPredictorPage() {
  const [valuationResult, setValuationResult] = useState<StockPredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationHistory, setValuationHistory] = useState<StockValuationHistoryItem[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tickerSymbol: '',
      optionType: undefined, 
      strikePrice: undefined,
      expiryDate: undefined,
      currentPrice: undefined,
      volatility: undefined,
      riskFreeRate: undefined,
      timeToExpiry: undefined,
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        try {
          setValuationHistory(JSON.parse(storedHistory));
        } catch (e) {
          console.error("Failed to parse stock valuation history from localStorage", e);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    }
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setValuationResult(null);

    const inputForAI: StockPredictionInput = {
      ...data,
      expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
    };

    const result = await handleStockPrediction(inputForAI);

    setIsLoading(false);
    if (result.success && result.data) {
      setValuationResult(result.data);
      const newHistoryItem: StockValuationHistoryItem = {
        id: new Date().toISOString() + Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toLocaleString(),
        input: inputForAI,
        output: result.data,
      };
      setValuationHistory(prevHistory => {
        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 5); // Keep last 5
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
        }
        return updatedHistory;
      });
      toast({
        title: "Valuation Successful",
        description: "Stock valuation has been generated.",
      });
    } else {
      setError(result.error || "An unknown error occurred.");
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, fieldError]) => {
          if (field !== "_errors" && fieldError?._errors?.[0]) {
             form.setError(field as keyof FormValues, { type: 'server', message: fieldError._errors[0] });
          }
        });
      }
      toast({
        title: "Valuation Failed",
        description: result.error || "Could not generate valuation.",
        variant: "destructive",
      });
    }
  };
  
  const handleClearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setValuationHistory([]);
    toast({ title: "Valuation History Cleared", description: "Your stock valuation history has been removed." });
  };

  return (
    <div className="space-y-12">
      <PageTitle
        title="Stock Valuation Predictor"
        subtitle="Enter stock option details to get an AI-powered future valuation estimate."
      />

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-primary">Valuation Input</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="About valuation methodology">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Valuation Methodology</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2 text-sm">
                  <p>
                    Our AI-powered stock valuation estimates are generated by a sophisticated model that analyzes the input parameters you provide.
                  </p>
                  <p>
                    The model considers principles from several analytical approaches:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Time-Series Analysis Concepts:</strong> The AI incorporates an understanding of how past price trends and seasonality (if inferable from context) can influence future valuations.
                    </li>
                    <li>
                      <strong>Volatility Insights:</strong> The provided volatility figure is a key input, helping the AI assess the potential range and likelihood of price movements affecting valuation.
                    </li>
                    <li>
                      <strong>Option Pricing Theory:</strong> The AI leverages its knowledge of how factors central to models like the Black-Scholes-Merton (e.g., strike price, time to expiry, current stock price, risk-free rate, volatility) interact to determine option values and imply future stock valuation expectations.
                    </li>
                    <li>
                      <strong>Contextual Understanding:</strong> The AI uses the ticker symbol and current price to place the valuation within a broader market context.
                    </li>
                  </ul>
                  <p>
                    The estimated valuation and accompanying analysis represent a synthesized output from these considerations. Please remember that these are AI-generated estimations for informational purposes and do not constitute financial advice.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Fill in the details below to generate a valuation estimate.</CardDescription>
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
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } 
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
                    Generating Valuation...
                  </>
                ) : (
                  "Get Valuation"
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

      {valuationResult && (
        <Card className="max-w-2xl mx-auto shadow-xl mt-12 animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-primary">
              <TrendingUp className="h-6 w-6" />
              Valuation Result
            </CardTitle>
            <CardDescription>AI-generated stock valuation and analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Estimated Stock Valuation</Label>
              <p className="text-3xl font-bold text-accent">
                ${valuationResult.predictedPrice.toFixed(2)} 
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Analysis</Label>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {valuationResult.analysis}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {valuationHistory.length > 0 && (
        <Card className="max-w-3xl mx-auto shadow-xl mt-12">
          <CardHeader className="flex flex-row items-center justify-between">
             <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <ArchiveIcon className="h-5 w-5" />
                Valuation History
            </CardTitle>
            <Button onClick={handleClearHistory} variant="outline" size="sm" className="ml-auto">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Clear History
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4">
              <div className="space-y-6">
                {valuationHistory.map((item) => (
                  <Card key={item.id} className="shadow-md">
                    <CardHeader>
                       <CardDescription className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div><strong className="text-primary/90">Ticker:</strong> {item.input.tickerSymbol}</div>
                        <div><strong className="text-primary/90">Option Type:</strong> {item.input.optionType}</div>
                        <div><strong className="text-primary/90">Strike Price:</strong> ${item.input.strikePrice.toFixed(2)}</div>
                        <div><strong className="text-primary/90">Current Price:</strong> ${item.input.currentPrice.toFixed(2)}</div>
                        <div><strong className="text-primary/90">Expiry:</strong> {format(parseISO(item.input.expiryDate), "PPP")}</div>
                        <div><strong className="text-primary/90">Volatility:</strong> {(item.input.volatility * 100).toFixed(1)}%</div>
                        <div><strong className="text-primary/90">Risk-Free Rate:</strong> {(item.input.riskFreeRate * 100).toFixed(1)}%</div>
                        <div><strong className="text-primary/90">Time to Expiry:</strong> {item.input.timeToExpiry.toFixed(2)} yrs</div>
                      </div>
                      <hr />
                      <div>
                        <h4 className="font-semibold text-accent mb-1">Estimated Valuation: ${item.output.predictedPrice.toFixed(2)}</h4>
                        <p className="text-foreground/80 whitespace-pre-wrap break-words">{item.output.analysis}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
