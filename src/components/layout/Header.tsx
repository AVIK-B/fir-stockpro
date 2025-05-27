import Link from 'next/link';
import { Landmark, Home, BookOpen, BarChartBig, FileSearch, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/stock-prediction', label: 'Stock Prediction', icon: BarChartBig },
  { href: '/market-insights', label: 'Market Insights', icon: FileSearch },
  { href: '/guidelines', label: 'User Guidelines', icon: BookOpen },
];

const NavLink = ({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void }) => (
  <Link href={href} passHref legacyBehavior>
    <a
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent/10 hover:text-primary transition-colors"
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

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 pt-6">
                {navItems.map((item) => (
                  <SheetTrigger asChild key={item.href}>
                     <NavLink {...item} />
                  </SheetTrigger>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
