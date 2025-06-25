import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-card p-8 shadow-2xl">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">Analyzing your FIRA...</p>
        <p className="text-sm text-muted-foreground">This might take a moment.</p>
      </div>
    </div>
  );
}
