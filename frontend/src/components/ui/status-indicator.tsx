import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "active" | "inactive"
  className?: string
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const isActive = status === "active"
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "size-2 rounded-full",
          isActive ? "bg-emerald-500" : "bg-muted-foreground"
        )}
      />
      <span className="text-xs font-medium text-muted-foreground capitalize">
        {status}
      </span>
    </div>
  )
}
