
'use client';

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle, PiggyBank, BarChart2, FileText, AlertTriangle, Info, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

import type { PortfolioSuggestionInput, PortfolioSuggestionOutput } from '@/ai/flows/portfolio-suggestion-flow';
import { handlePortfolioSuggestion } from './actions';

const formSchema = z.object({
  investmentAmount: z.coerce
    .number({ invalid_type_error: "Investment amount must be a number." })
    .min(100, "Minimum investment amount is $100.")
    .max(10000000, "Maximum investment amount is $10,000,000."),
  riskTolerance: z.enum(['Low', 'Medium', 'High'], { required_error: "Please select your risk tolerance." }),
  targetAnnualReturn: z.coerce
    .number({ invalid_type_error: "Target return must be a number." })
    .min(0.1, "Target return should be at least 0.1%.")
    .max(100, "A target return over 100% is highly speculative and likely unrealistic for most diversified portfolios.")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
];


export default function PortfolioInvestmentSuggestionsPage() {
  const [suggestionResult, setSuggestionResult] = useState<PortfolioSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: '', 
      riskTolerance: undefined,
      targetAnnualReturn: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestionResult(null);

    const dataForAI: PortfolioSuggestionInput = {
        ...data,
        investmentAmount: Number(data.investmentAmount),
        targetAnnualReturn: data.targetAnnualReturn ? Number(data.targetAnnualReturn) : undefined,
    };

    const result = await handlePortfolioSuggestion(dataForAI);

    setIsLoading(false);
    if (result.success && result.data) {
      setSuggestionResult(result.data);
      toast({
        title: "Portfolio Suggestions Generated",
        description: "Your AI-powered portfolio suggestions are ready.",
      });
    } else {
      setError(result.error || "An unknown error occurred.");
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, fieldError]) => {
          const castedField = field as keyof FormValues;
          if (field !== "_errors" && fieldError?._errors?.[0] && Object.keys(form.getValues()).includes(castedField)) {
            form.setError(castedField, { type: 'server', message: fieldError._errors[0] });
          }
        });
      }
      toast({
        title: "Suggestion Failed",
        description: result.error || "Could not generate portfolio suggestions.",
        variant: "destructive",
      });
    }
  };
  
  const chartConfig = useMemo<ChartConfig>(() => {
    const allocation = suggestionResult?.portfolioAllocation;
    if (!Array.isArray(allocation) || allocation.length === 0) {
      return {} as ChartConfig;
    }
    
    const config: ChartConfig = {};
    allocation.forEach((asset, index) => {
      if (asset && typeof asset.assetClass === 'string') {
        config[asset.assetClass] = {
          label: asset.assetClass,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      }
    });
    return config;
  }, [suggestionResult]);

  const chartData = useMemo(() => {
    const allocation = suggestionResult?.portfolioAllocation;
    if (!Array.isArray(allocation) || allocation.length === 0 || Object.keys(chartConfig).length === 0) {
      return []; 
    }
    const mappedData = allocation.map(asset => {
      if (asset && typeof asset.assetClass === 'string' && typeof asset.percentage === 'number') {
        return {
          name: asset.assetClass,
          value: asset.percentage,
          fill: chartConfig[asset.assetClass]?.color || CHART_COLORS[0], 
        };
      }
      return null; 
    });
    return mappedData.filter(item => item !== null) as { name: string; value: number; fill: string; }[];
  }, [suggestionResult, chartConfig]);


  return (
    <div className="space-y-12">
      <PageTitle
        title="AI-Driven Portfolio Investment Suggestions"
        subtitle="Enter your investment details to receive AI-generated portfolio suggestions tailored to your goals."
      />
      
      <Alert variant="default" className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary">How This Tool Works</AlertTitle>
        <AlertDescription className="text-primary/80">
          This tool uses AI to generate sample diversified portfolio suggestions. It considers your investment amount, risk tolerance, and optional target annual return,
          balancing potential returns with risks based on its general market understanding.
          The output includes asset allocations, rationale, and an estimated return range.
          <strong>This is for informational purposes only and is NOT financial advice.</strong>
        </AlertDescription>
      </Alert>

      <Card className="max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <PiggyBank className="h-6 w-6"/>
            Your Investment Profile
          </CardTitle>
          <CardDescription>Tell us about your investment goals for AI-powered suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="investmentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Amount (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10000" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your risk tolerance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAnnualReturn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Target Annual Return (%)
                      <span className="text-xs text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 8 for 8%" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Suggestions...
                  </>
                ) : (
                  "Get Investment Suggestions"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Suggestion</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestionResult && (
        <div className="max-w-4xl mx-auto space-y-8 mt-12 animate-fadeIn">
          <Card className="shadow-xl border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive/90 leading-relaxed whitespace-pre-wrap">
                {suggestionResult.importantDisclaimer}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <BarChart2 className="h-6 w-6" />
                Suggested Portfolio Allocation
              </CardTitle>
              <CardDescription>
                Based on an investment of ${Number(form.getValues('investmentAmount')).toLocaleString()} 
                with {form.getValues('riskTolerance')} risk tolerance
                {form.getValues('targetAnnualReturn') ? ` and a target annual return of ${form.getValues('targetAnnualReturn')}%` : ''}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="w-full h-[300px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ right: 30, left: 30, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" unit="%" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={150} interval={0} style={{ fontSize: '0.8rem' }}/>
                      <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Legend content={<ChartLegendContent verticalAlign="bottom" wrapperStyle={{paddingTop: "20px"}} />} />
                      <Bar dataKey="value" radius={4}>
                         {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : <p>No allocation data to display.</p>}
            </CardContent>
          </Card>
          
          <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl text-primary">Allocation Details & Rationale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {suggestionResult.portfolioAllocation.map((asset, index) => (
                    <div key={index} className="p-3 border rounded-md bg-background/50">
                        <h4 className="font-semibold text-primary/90">{asset.assetClass} ({asset.percentage.toFixed(1)}%)</h4>
                        <p className="text-sm text-foreground/80 mt-1">{asset.rationale}</p>
                    </div>
                ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-primary">
                 <Target className="h-5 w-5" /> Projected Annual Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-accent">
                  {suggestionResult.projectedReturnRange.low.toFixed(1)}% - {suggestionResult.projectedReturnRange.high.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">This is an estimated range and not a guarantee.</p>
              </CardContent>
            </Card>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-primary">
                  <AlertCircle className="h-5 w-5" /> Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{suggestionResult.riskAnalysis}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <FileText className="h-5 w-5" />
                Strategy Commentary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{suggestionResult.strategyCommentary}</p>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
