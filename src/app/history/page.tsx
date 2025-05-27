
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Banknote, AlertOctagon, Zap, Users, Activity } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="space-y-12">
      <PageTitle
        title="History of Stock Market & Trading"
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
          <ul className="list-disc list-inside space-y-3 pl-4">
            <li>
              <strong>Tulip Mania (1637):</strong> One of the earliest recorded speculative bubbles, where prices for tulip bulbs in the Netherlands reached extraordinary highs before collapsing.
            </li>
            <li>
              <strong>The Panic of 1907:</strong> A financial crisis in the US triggered by a failed attempt to corner the market on United Copper Company stock, leading to bank runs and highlighting the need for a central bank, which culminated in the creation of the Federal Reserve System in 1913.
            </li>
            <li>
              <strong>The Wall Street Crash of 1929 & The Great Depression (1930s):</strong> A devastating stock market crash, beginning with Black Tuesday (October 29, 1929), that wiped out billions in market value and precipitated a decade-long global economic depression. This led to significant government intervention and financial regulations, including the Glass-Steagall Act and the formation of the Securities and Exchange Commission (SEC).
            </li>
             <li>
              <strong>Black Monday (1987):</strong> Stock markets worldwide crashed, with the Dow Jones Industrial Average (DJIA) falling over 22% in a single day. Program trading (computerized trading strategies) was widely blamed for exacerbating the sell-off. Circuit breakers were subsequently introduced to halt trading during extreme volatility.
            </li>
            <li>
              <strong>The Global Financial Crisis (2007-2008):</strong> Triggered by the collapse of the US housing market due to widespread defaults on subprime mortgages and the subsequent failure or near-failure of major financial institutions.
              <ul className="list-disc list-inside space-y-1 pl-5 mt-2 text-sm">
                <li><strong>Key Causes:</strong> Lax lending standards, complex financial instruments like Collateralized Debt Obligations (CDOs) and Mortgage-Backed Securities (MBS) that spread risk opaquely, and failures in credit rating agencies.</li>
                <li><strong>Impacted Companies:</strong> Lehman Brothers filed for bankruptcy, marking a pivotal moment. Bear Stearns was acquired by JPMorgan Chase in a fire sale. AIG (American International Group), a massive insurer, required an enormous government bailout due to its exposure to credit default swaps. Many other banks like Citigroup and Bank of America also faced severe difficulties and required government assistance (TARP - Troubled Asset Relief Program).</li>
                <li><strong>Profiting Entities (Complex):</strong> While widespread losses occurred, some hedge funds, like those managed by John Paulson, famously profited by shorting the housing market (betting against mortgage-backed securities). Some stronger financial institutions were able to acquire weaker rivals at distressed prices.</li>
              </ul>
              This crisis led to a severe global recession and significant regulatory reforms like the Dodd-Frank Wall Street Reform and Consumer Protection Act.
            </li>
            <li>
              <strong>COVID-19 Pandemic Crash (2020):</strong> A sharp, rapid global stock market crash in February-March 2020 caused by the economic uncertainty and widespread shutdowns related to the COVID-19 pandemic.
               <ul className="list-disc list-inside space-y-1 pl-5 mt-2 text-sm">
                <li><strong>Immediate Impact:</strong> Airlines, cruise lines, hospitality (hotels, restaurants), and brick-and-mortar retail stocks plummeted as travel ceased and businesses closed. Oil prices also crashed due to a sudden drop in demand.</li>
                <li><strong>Companies/Sectors That Thrived or Adapted Quickly:</strong>
                    <ul>
                        <li><strong>Technology & E-commerce:</strong> Companies like Amazon (e-commerce, cloud), Microsoft (cloud, remote work tools), Apple (devices), and Alphabet/Google (digital services) saw increased demand.</li>
                        <li><strong>Remote Work & Communication:</strong> Zoom Video Communications became a household name.</li>
                        <li><strong>Streaming & Entertainment:</strong> Netflix and other streaming services benefited from stay-at-home orders.</li>
                        <li><strong>Pharmaceuticals & Biotech:</strong> Companies involved in vaccine development (e.g., Pfizer, Moderna, AstraZeneca, Johnson & Johnson) and COVID-19 treatments saw significant attention and investment.</li>
                        <li><strong>Logistics & Delivery:</strong> Companies involved in delivering goods saw a surge in business.</li>
                    </ul>
                </li>
                <li><strong>Recovery:</strong> Markets recovered relatively quickly due to unprecedented government stimulus packages and central bank interventions, though the recovery was uneven across sectors.</li>
              </ul>
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
