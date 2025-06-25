'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="w-[450px] text-center">
      <CardHeader className="items-center gap-4 p-6">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <CardTitle>Analysis Failed</CardTitle>
          <CardDescription>{message}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Button onClick={onRetry} className="w-full">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
