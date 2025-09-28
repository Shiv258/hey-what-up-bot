
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
            <img 
                src="https://xxglwevjclidblnuqgdd.supabase.co/storage/v1/object/public/voice/Ravan%20Logo%202-Enhanced.jpg"
                alt="Ravan.ai Logo"
                width={180}
                height={48}
                className="h-12 w-auto"
            />
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link to="/generations">
            <Button variant="ghost" size="sm">Generation History</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
