export function Footer() {
  return (
    <footer className="border-t bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StockPro Analytics. All rights reserved.</p>
        <p className="mt-1">
          Disclaimer: StockPro Analytics provides predictions and insights for informational purposes only. 
          It is not financial advice. Consult with a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </footer>
  );
}
