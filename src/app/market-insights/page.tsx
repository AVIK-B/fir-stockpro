
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lightbulb, AlertCircle, Newspaper, Activity, AlertTriangleIcon, Info } from 'lucide-react';

import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

import type { MarketInsightsInput, MarketInsightsOutput } from '@/ai/flows/market-insights';
import { handleMarketInsights } from './actions';

const formSchema = z.object({
  marketIndicators: z.string().min(10, "Please provide some market indicators for analysis (min. 10 characters).").max(2000, "Market indicators input is too long (max. 2000 characters)."),
  pastStockData: z.string().min(10, "Please provide some past stock data for analysis (min. 10 characters).").max(2000, "Past stock data input is too long (max. 2000 characters)."),
});

type FormValues = z.infer<typeof formSchema>;

export default function MarketInsightsPage() {
  const [insightsResult, setInsightsResult] = useState<MarketInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketIndicators: '',
      pastStockData: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setInsightsResult(null);

    const result = await handleMarketInsights(data);

    setIsLoading(false);
    if (result.success && result.data) {
      setInsightsResult(result.data);
      toast({
        title: "Insights Generated",
        description: "Market insights have been successfully generated.",
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
        title: "Insights Generation Failed",
        description: result.error || "Could not generate market insights.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-12">
      <PageTitle
        title="AI-Driven Market Insights"
        subtitle="Enter market indicators and past stock data to get AI-generated analysis."
      />

      <Alert className="max-w-2xl mx-auto">
        <Info className="h-4 w-4" />
        <AlertTitle>Understanding Market Insights</AlertTitle>
        <AlertDescription>
          This tool provides analysis of broader market trends and economic indicators. 
          For predictions on specific stocks (e.g., future price of AAPL), please use the {' '}
          <Link href="/stock-prediction" className="font-semibold text-primary hover:underline">
            Stock Prediction tool
          </Link>.
        </AlertDescription>
      </Alert>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Insights Input</CardTitle>
          <CardDescription>Provide context for the AI to analyze market conditions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="marketIndicators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Indicators</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Interest rates rising, inflation at 5%, unemployment low, new tech advancements..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastStockData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Stock Data / Trends</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., S&P 500 up 10% last quarter, tech sector booming, energy stocks volatile..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Insights...
                  </>
                ) : (
                  "Get Market Insights"
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

      {insightsResult && (
        <div className="max-w-3xl mx-auto space-y-8 mt-12 animate-fadeIn">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <Newspaper className="h-6 w-6" />
                Market Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{insightsResult.summary}</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <Activity className="h-6 w-6" />
                Key Influencing Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{insightsResult.factors}</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <AlertTriangleIcon className="h-6 w-6" />
                Potential Risks & Uncertainties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{insightsResult.risks}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

