"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        <div
          className={cn(
            "border-2 border-muted rounded-full animate-spin",
            "border-t-primary border-r-primary/50",
            sizeClasses[size],
          )}
        />
        <div
          className={cn(
            "absolute inset-0 border-2 border-transparent rounded-full animate-ping",
            "border-t-primary/30",
            sizeClasses[size],
          )}
          style={{ animationDelay: "0.5s" }}
        />
      </div>
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}
