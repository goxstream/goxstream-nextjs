export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-8 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col gap-1">
          <span className="font-heading font-bold text-xl text-primary">GoxStream</span>
          <p className="text-sm text-muted-foreground font-body">
            The ultimate modern anime streaming platform. For demonstration purposes only.
          </p>
        </div>
        <p className="text-sm text-muted-foreground font-body">
          &copy; {new Date().getFullYear()} GoxStream. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
