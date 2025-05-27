
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, TrendingUp, FileText, Activity, Newspaper as FileSearch } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="space-y-12">
      <PageTitle
        title="User Guidelines"
        subtitle="Understanding and effectively using StockPro Analytics tools."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <Lightbulb className="h-6 w-6" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            Welcome to StockPro Analytics! Our platform provides AI-powered tools to assist you in analyzing stock options and market trends. These guidelines will help you understand how to use our valuation and insights tools effectively.
          </p>
          <p>
            Our tools are designed to supplement your own research and analysis, not replace it. The stock market is inherently volatile, and estimations are not guarantees of future performance.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <TrendingUp className="h-6 w-6" />
            Using the Stock Valuation Predictor Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            The Stock Valuation Predictor Tool uses multiple algorithms to estimate potential future stock valuations. To use it:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Ticker Symbol:</strong> Enter the stock's ticker (e.g., AAPL for Apple Inc.).</li>
            <li><strong>Option Type:</strong> Select 'Call' (betting the price will rise) or 'Put' (betting the price will fall).</li>
            <li><strong>Strike Price:</strong> The price at which the option can be exercised.</li>
            <li><strong>Expiry Date:</strong> The date when the option contract expires.</li>
            <li><strong>Current Price:</strong> The current market price of the stock.</li>
            <li><strong>Volatility:</strong> The stock's historical volatility (often expressed as a decimal, e.g., 0.3 for 30%).</li>
            <li><strong>Risk-Free Rate:</strong> The current risk-free interest rate (e.g., Treasury bill rate, as a decimal like 0.02 for 2%).</li>
            <li><strong>Time to Expiry (Years):</strong> The time remaining until the option expires, in years (e.g., 0.25 for 3 months).</li>
          </ul>
          <p>
            After submitting the form, the tool will provide an estimated valuation and a brief analysis. This valuation is an average derived from various algorithmic models.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <FileSearch className="h-6 w-6" />
            Using the AI Market Insights Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            The Market Insights Tool generates analysis based on broader market data:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Market Indicators:</strong> Provide current relevant market indicators (e.g., "Interest rates are rising, inflation is at 5%, unemployment is low"). Be as descriptive as possible.</li>
            <li><strong>Past Stock Data:</strong> Summarize relevant historical stock data or trends (e.g., "The S&P 500 has seen a 10% increase in the last quarter, tech stocks are outperforming").</li>
          </ul>
          <p>
            The AI will analyze this information to provide a summary, identify key influencing factors, and outline potential market risks.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Important Considerations & Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-destructive/90 leading-relaxed">
          <p>
            <strong>Not Financial Advice:</strong> The information and estimations provided by StockPro Analytics are for informational and educational purposes only. They do not constitute financial, investment, or trading advice.
          </p>
          <p>
            <strong>Risk of Loss:</strong> Trading stock options involves significant risk of loss and is not suitable for all investors. You could lose more than your initial investment.
          </p>
          <p>
            <strong>Model Limitations:</strong> AI models and algorithms, while powerful, have limitations. They are based on historical data and assumptions that may not hold true in future market conditions. Unexpected events can significantly impact market behavior.
          </p>
          <p>
            <strong>Do Your Own Research:</strong> Always conduct your own thorough research and consider multiple sources of information before making any investment decisions. Consult with a qualified financial advisor.
          </p>
          <p>
            <strong>Accuracy Not Guaranteed:</strong> While we strive for accuracy, we cannot guarantee the completeness or correctness of the data or estimations provided.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
