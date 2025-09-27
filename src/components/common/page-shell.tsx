import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function PageShell({
  children,
  className,
  as: Comp = "div",
  ...props
}: PageShellProps) {
  return (
    <Comp className={cn("flex-1", className)} {...props}>
      {children}
    </Comp>
  );
}
