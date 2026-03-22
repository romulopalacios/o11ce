import BaseSurface from "@/components/ui/base/BaseSurface";
import { cn } from "@/lib/utils";

interface BaseStateProps {
  title: string;
  description: string;
  tone?: "neutral" | "error";
  className?: string;
}

export default function BaseState({ title, description, tone = "neutral", className }: BaseStateProps) {
  return (
    <BaseSurface
      className={cn(
        "p-4",
        tone === "error" && "border-loss/40 bg-loss/10",
        className,
      )}
    >
      <h3 className="text-ui-base font-medium text-primary">{title}</h3>
      <p className="mt-1 text-ui-sm text-muted-foreground">{description}</p>
    </BaseSurface>
  );
}
