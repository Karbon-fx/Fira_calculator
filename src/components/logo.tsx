import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
        <path
          d="M17.408 13.6V11H19.2V9.2H17.408V7H15.608V9.2H10V11H15.608V13.6H10V15.4H15.608V22H17.408V15.4H19.2V20.2H21V15.4H22V13.6H17.408Z"
          fill="hsl(var(--primary-foreground))"
        />
      </svg>
      <span className="text-xl font-bold font-headline text-foreground">
        FIRC Clarity
      </span>
    </div>
  );
}
