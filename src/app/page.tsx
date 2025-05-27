
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Briefcase, Newspaper, FileText, Landmark, History as HistoryIcon, PiggyBank } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="mb-8">
          <Landmark className="h-20 w-20 text-primary mx-auto" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
          Welcome to StockPro Analytics
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-foreground/80">
          Empowering your stock options trading with AI-driven valuations, market insights, and portfolio suggestions. 
          Make informed decisions using advanced algorithmic analysis.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/stock-valuation-predictor">Get Stock Valuation</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
            <Link href="/market-insights">Explore Market Insights</Link>
          </Button>
           <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/portfolio-investment-suggestions">Portfolio Investment Suggestions</Link>
          </Button>
        </div>
      </section>

      {/* Navigating the Market Section */}
      <section className="py-12">
        <Card className="max-w-4xl mx-auto shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
              <Briefcase className="h-16 w-16 text-accent sm:ml-2" />
              <div>
                <CardTitle className="text-3xl text-primary">Navigating the Market: Stocks & Options</CardTitle>
                <CardDescription className="text-lg text-foreground/70 mt-1">
                  Understanding the fundamentals to trade smarter.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">The Stock Market Basics</h3>
              <p className="text-foreground/80 leading-relaxed">
                The stock market is a dynamic environment where shares of publicly traded companies are bought and sold. It allows businesses to raise capital for growth and offers investors the opportunity to own a piece of those companies, potentially growing their wealth over time. Prices fluctuate based on company performance, economic conditions, and investor sentiment.
              </p>
            </div>
            <hr className="my-6 border-border" />
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Understanding Stock Options</h3>
              <p className="text-foreground/80 leading-relaxed mb-3">
                Stock options are contracts that grant the holder the right—but not the obligation—to buy or sell a specific stock at a predetermined price, known as the <strong className="text-foreground">strike price</strong>, on or before a specific <strong className="text-foreground">expiration date</strong>.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Options trading can be a versatile tool for:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/70 pl-4">
                <li><strong className="text-foreground/90">Hedging Risk:</strong> Protecting existing investments against potential price declines.</li>
                <li><strong className="text-foreground/90">Generating Income:</strong> Earning premiums by selling options.</li>
                <li><strong className="text-foreground/90">Speculating:</strong> Betting on the future direction of a stock's price with potentially amplified returns (and risks).</li>
              </ul>
              <p className="mt-3 text-foreground/80 leading-relaxed">
                Successfully trading options requires understanding factors like stock volatility, time decay, and interest rates.
              </p>
            </div>
             <hr className="my-6 border-border" />
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">How StockPro Analytics Helps</h3>
              <p className="text-foreground/80 leading-relaxed">
                StockPro Analytics aims to demystify the complexities of options trading and portfolio construction. Our AI-powered tools analyze critical factors to provide you with data-driven stock valuations, broader market insights, and sample portfolio suggestions, helping you make more informed decisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Cpu className="h-10 w-10 text-accent" />}
            title="Stock Valuation Predictor Tool"
            description="Utilize our AI-powered tool that integrates multiple advanced algorithms to estimate future stock valuations. Get an averaged, data-driven outlook."
            link="/stock-valuation-predictor"
            linkLabel="Use Valuation Tool"
          />
          <FeatureCard
            icon={<Newspaper className="h-10 w-10 text-accent" />}
            title="AI Market Insights"
            description="Gain valuable insights based on current market indicators and historical data. Understand key factors, trends, and potential risks."
            link="/market-insights"
            linkLabel="Get Market Insights"
          />
           <FeatureCard
            icon={<PiggyBank className="h-10 w-10 text-accent" />}
            title="AI Portfolio Investment Suggestions"
            description="Receive AI-generated portfolio suggestions based on your investment amount and risk tolerance. Visualize potential allocations."
            link="/portfolio-investment-suggestions"
            linkLabel="Get Suggestions"
          />
          <FeatureCard
            icon={<HistoryIcon className="h-10 w-10 text-accent" />}
            title="History of Stock Market & Trading"
            description="Explore pivotal moments, legendary rivalries, and transformative crises that shaped modern stock markets and investing."
            link="/history"
            linkLabel="View History"
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-accent" />}
            title="User Guidelines"
            description="Clear and concise guidelines on how to effectively use our tools and interpret the results for your trading strategies."
            link="/guidelines"
            linkLabel="Read Guidelines"
          />
        </div>
      </section>
      
      {/* Call to Action Bottom */}
      <section className="py-12 text-center">
         <h2 className="text-3xl font-bold text-primary mb-6">Ready to Elevate Your Trading?</h2>
         <p className="max-w-2xl mx-auto text-lg text-foreground/80 mb-8">
            Dive into the world of AI-assisted stock option analysis and portfolio planning with StockPro Analytics.
         </p>
         <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/portfolio-investment-suggestions">Start Analyzing Now</Link>
          </Button>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

function FeatureCard({ icon, title, description, link, linkLabel }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center">
        <div className="p-3 rounded-full bg-accent/10 mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base text-foreground/70">{description}</CardDescription>
      </CardContent>
      <CardContent>
        <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
          <Link href={link}>{linkLabel} &rarr;</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
