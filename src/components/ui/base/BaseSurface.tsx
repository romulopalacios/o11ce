import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface BaseSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export default function BaseSurface({ className, interactive = false, ...props }: BaseSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface text-primary",
        interactive && "transition-all duration-200 ease-in-out hover:border-border2 hover:bg-surface2",
        className,
      )}
      {...props}
    />
  );
}
