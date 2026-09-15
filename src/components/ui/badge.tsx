import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.ComponentProps<"span"> & { tone?: "neutral" | "high" | "medium" | "low" | "insufficient" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tone === "high" && "bg-high/20 text-high",
        tone === "medium" && "bg-warn/20 text-warn",
        tone === "low" && "bg-low/20 text-low",
        tone === "insufficient" && "bg-subtle text-muted",
        tone === "neutral" && "bg-subtle text-muted",
        className,
      )}
      {...props}
    />
  );
}
