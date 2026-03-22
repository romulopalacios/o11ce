import Link from "next/link";

import { cn } from "@/lib/utils";

interface BaseSectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export default function BaseSectionHeader({ title, actionLabel, actionHref, className }: BaseSectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-baseline justify-between gap-3", className)}>
      <h2 className="font-mono text-ui-2xs font-medium uppercase tracking-[.12em] text-text3">{title}</h2>
      {actionLabel ? (
        actionHref ? (
          <Link
            href={actionHref}
            className="text-ui-xs text-muted-foreground transition-colors duration-200 ease-in-out hover:text-primary"
          >
            {actionLabel}
          </Link>
        ) : (
          <span className="text-ui-xs text-muted-foreground">{actionLabel}</span>
        )
      ) : null}
    </div>
  );
}
