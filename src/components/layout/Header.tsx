
import Link from 'next/link';
import { Landmark, Home, Menu, ScrollText, TrendingUp, Newspaper, FileText, History as HistoryIcon, Cpu } from 'lucide-react'; // Added HistoryIcon, Cpu for consistency
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/stock-prediction', label: 'Stock Prediction', icon: TrendingUp },
  { href: '/market-insights', label: 'Market Insights', icon: Newspaper },
  { href: '/history', label: 'Stock Market History', icon: HistoryIcon },
  { href: '/guidelines', label: 'User Guidelines', icon: FileText },
];

const NavLink = ({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void }) => (
  <Link href={href} passHref legacyBehavior>
    <a
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-md font-medium rounded-lg text-foreground hover:bg-accent/10 hover:text-primary transition-colors"
    >
      <Icon className="h-5 w-5" />
      {label}
    </a>
  </Link>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Left Items */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[320px] p-0 flex flex-col bg-background">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="p-4 border-b">
                <Link href="/" passHref legacyBehavior>
                  <a className="flex items-center gap-2 text-lg font-bold text-primary">
                    <Landmark className="h-6 w-6" />
                    <span>StockPro Analytics</span>
                  </a>
                </Link>
              </div>
              <div className="flex-grow overflow-y-auto p-4">
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                     <SheetClose asChild key={item.href}>
                       <NavLink {...item} />
                     </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Centered */}
        <div className="flex-1 flex justify-center">
          <Link href="/" passHref legacyBehavior>
            <a className="flex items-center gap-2 text-xl font-bold text-primary">
              <Landmark className="h-7 w-7" />
              <span>StockPro Analytics</span>
            </a>
          </Link>
        </div>

        {/* Right Spacer - to balance the left items for true centering of the logo */}
        <div className="flex items-center gap-2 invisible" aria-hidden="true">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}

