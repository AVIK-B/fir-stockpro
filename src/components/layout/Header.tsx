
import Link from 'next/link';
import { Landmark, Home, Menu, ScrollText, TrendingUp, Newspaper, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'; // Removed SheetHeader import, added SheetTitle
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/stock-prediction', label: 'Stock Prediction', icon: TrendingUp },
  { href: '/market-insights', label: 'Market Insights', icon: Newspaper },
  { href: '/history', label: 'Trading History', icon: ScrollText },
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
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" passHref legacyBehavior>
          <a className="flex items-center gap-2 text-xl font-bold text-primary">
            <Landmark className="h-7 w-7" />
            <span>StockPro Analytics</span>
          </a>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[320px] p-0 flex flex-col bg-background">
              {/* Programmatic title for accessibility, direct child of SheetContent */}
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              
              {/* Visual header/branding for the sheet */}
              <div className="p-4 border-b">
                <Link href="/" passHref legacyBehavior>
                  <a className="flex items-center gap-2 text-lg font-bold text-primary">
                    <Landmark className="h-6 w-6" />
                    <span>StockPro Analytics</span>
                  </a>
                </Link>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4"> {/* Wrapper for scrollable content */}
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
      </div>
    </header>
  );
}
