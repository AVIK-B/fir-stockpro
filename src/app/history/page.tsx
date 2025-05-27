
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Banknote, AlertOctagon, Zap, Users, Activity } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="space-y-12">
      <PageTitle
        title="A Journey Through Stock Trading History"
        subtitle="Exploring pivotal moments, legendary rivalries, and transformative crises that shaped modern markets."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <Banknote className="h-7 w-7" />
            The Dawn of Stock Trading
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            The concept of tradable shares dates back to the Roman Republic, but the first formal stock market is widely considered to be the Amsterdam Stock Exchange, founded in 1602 by the Dutch East India Company (VOC). It was here that shares in a company were first continuously traded, laying the groundwork for modern financial markets.
          </p>
          <p>
            Early stock trading was characterized by its novelty, speculation, and the slow dissemination of information. Coffee houses in London became informal centers for trading in the late 17th century, eventually leading to the formation of the London Stock Exchange.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <Zap className="h-7 w-7" />
            Famous Market Rivalries & Innovations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            While not always "rivalries" in the traditional sense, competition between companies and innovators has always driven market dynamics:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Railroad Barons (19th Century):</strong> Figures like Cornelius Vanderbilt and Jay Gould engaged in fierce battles for control of America's burgeoning railway networks, leading to legendary stock market manipulations and contests.
            </li>
            <li>
              <strong>Ford vs. General Motors (20th Century):</strong> The competition to dominate the automotive industry led to massive capital investments, innovations in production, and significant stock market activity, reflecting broader economic shifts.
            </li>
            <li>
              <strong>The Dot-com Bubble (Late 1990s - Early 2000s):</strong> A period of intense speculation in internet-based companies. While many "rivalries" were short-lived as companies boomed and busted, this era fundamentally changed how technology companies were valued and funded, with giants like Amazon and eBay emerging.
            </li>
            <li>
              <strong>Apple vs. Microsoft (Late 20th - 21st Century):</strong> A classic tech rivalry that has spanned decades, influencing personal computing, mobile technology, and by extension, their stock market valuations and investor sentiment.
            </li>
          </ul>
           <p>Technological advancements like the telegraph, telephone, and eventually the internet revolutionized trading speed and information access, making markets more efficient but also more volatile.</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <Activity className="h-7 w-7" />
            Evolution of Trading and Market Participants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            Stock trading has evolved from open outcry pits to sophisticated electronic platforms. Key developments include:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>The Ticker Tape (1867):</strong> Allowed for near real-time dissemination of stock prices, democratizing information access beyond the trading floor.</li>
            <li><strong>Rise of Institutional Investors:</strong> Throughout the 20th century, pension funds, mutual funds, and insurance companies became major market players, influencing trading volumes and strategies.</li>
            <li><strong>Deregulation and Globalization (Late 20th Century):</strong> Reduced barriers to international investment and led to interconnected global markets.</li>
            <li><strong>Algorithmic and High-Frequency Trading (HFT) (21st Century):</strong> Computer algorithms executing trades in fractions of a second now account for a significant portion of trading volume, bringing new complexities and efficiency debates.</li>
            <li><strong>Retail Investor Boom (21st Century):</strong> Online brokerage platforms and commission-free trading have empowered individual investors, leading to increased participation and phenomena like meme stocks.</li>
          </ul>
        </CardContent>
      </Card>


      <Card className="shadow-lg border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-destructive">
            <AlertOctagon className="h-7 w-7" />
            Great Depressions & Market Crashes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-destructive/90 leading-relaxed">
          <p>
            Market history is punctuated by periods of crisis that have led to significant economic downturns and regulatory reforms:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Tulip Mania (1637):</strong> One of the earliest recorded speculative bubbles, where prices for tulip bulbs in the Netherlands reached extraordinary highs before collapsing.
            </li>
            <li>
              <strong>The Panic of 1907:</strong> A financial crisis in the US that led to the creation of the Federal Reserve System.
            </li>
            <li>
              <strong>The Wall Street Crash of 1929 & The Great Depression (1930s):</strong> A devastating stock market crash that precipitated a decade-long global economic depression, leading to significant government intervention and financial regulations (e.g., SEC formation).
            </li>
             <li>
              <strong>Black Monday (1987):</strong> Stock markets worldwide crashed, shedding a huge value in a very short time, largely attributed to program trading.
            </li>
            <li>
              <strong>The Global Financial Crisis (2007-2008):</strong> Triggered by the collapse of the US housing market and the subsequent failure of major financial institutions, leading to a severe global recession and renewed calls for financial reform.
            </li>
            <li>
              <strong>COVID-19 Pandemic Crash (2020):</strong> A sharp, rapid global stock market crash caused by the economic uncertainty and shutdowns related to the COVID-19 pandemic, followed by a swift, but uneven, recovery.
            </li>
          </ul>
          <p>
            These events, while painful, often serve as catalysts for regulatory changes aimed at creating more stable and transparent financial systems.
          </p>
        </CardContent>
      </Card>
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <Users className="h-7 w-7" />
            Learning from History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            Understanding stock trading history provides valuable context for today's investors. It highlights recurring patterns of human behavior (fear and greed), the impact of innovation, and the importance of risk management. While history doesn't repeat exactly, its lessons remain relevant.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
