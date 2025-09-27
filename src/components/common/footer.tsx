import Link from "next/link";
import { RavanLogo } from "./RavanLogo";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <Link href="/" className="flex items-center space-x-2">
              <RavanLogo className="h-6 w-auto" />
              <span className="text-lg font-bold">Ravan.ai</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ravan.ai. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:items-end">
            <div className="flex space-x-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
