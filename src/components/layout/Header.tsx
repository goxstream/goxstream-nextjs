import Link from 'next/link';
import { Search, User, Menu, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <button className="mr-2 md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-heading font-bold text-xl text-primary">
              GoxStream
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="search"
                placeholder="Search anime..."
                className="h-9 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm md:w-[300px] lg:w-[400px] border-transparent font-body focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <button className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground h-9 w-9 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground h-9 w-9 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
