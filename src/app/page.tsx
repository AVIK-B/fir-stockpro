import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BarChartBig, FileSearch, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
          Welcome to StockPro Analytics
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-foreground/80">
          Empowering your stock options trading with AI-driven predictions and market insights. 
          Make informed decisions using advanced algorithmic analysis.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/stock-prediction">Get Stock Prediction</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
            <Link href="/market-insights">Explore Market Insights</Link>
          </Button>
        </div>
      </section>

      {/* Placeholder Image Section */}
      <section className="py-12">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="https://placehold.co/1200x600.png"
            alt="Stock Market Analysis Illustration"
            width={1200}
            height={600}
            className="object-cover w-full h-full"
            data-ai-hint="stock market graph"
            priority
          />
        </div>
      </section>

      {/* What is Stock Options Trading? */}
      <section className="py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-primary text-center">What is Stock Options Trading?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">
              Stock options are contracts that give the owner the right, but not the obligation, to buy or sell a specific stock at a predetermined price (strike price) on or before a specific date (expiration date). Options trading can be complex but offers opportunities for hedging risk, generating income, or speculating on market movements. Understanding the factors that influence option prices, like stock volatility, time to expiration, and interest rates, is crucial for success.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              StockPro Analytics aims to simplify this complexity by providing tools that leverage AI to analyze these factors and offer potential future stock price predictions and market insights.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChartBig className="h-10 w-10 text-accent" />}
            title="Algorithmic Stock Prediction"
            description="Utilize our AI-powered tool that integrates multiple advanced algorithms to predict future stock prices. Get an averaged, data-driven outlook."
            link="/stock-prediction"
            linkLabel="Try Prediction Tool"
          />
          <FeatureCard
            icon={<FileSearch className="h-10 w-10 text-accent" />}
            title="AI-Driven Market Insights"
            description="Gain valuable insights based on current market indicators and historical data. Understand key factors, trends, and potential risks."
            link="/market-insights"
            linkLabel="Get Market Insights"
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-accent" />}
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
            Dive into the world of AI-assisted stock option analysis with StockPro Analytics.
         </p>
         <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/stock-prediction">Start Analyzing Now</Link>
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
