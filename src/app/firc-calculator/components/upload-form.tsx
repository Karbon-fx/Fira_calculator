'use client';

import { useState, useRef, DragEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UploadCloud, FileText, XCircle, ShieldCheck } from 'lucide-react';

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !hasFile} className="w-full">
      {pending ? 'Analyzing...' : 'Analyze FIRA'}
    </Button>
  );
}

export function UploadForm({ error }: { error: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-headline">FIRC Hidden Cost Calculator</CardTitle>
        <CardDescription className="text-center">
          Upload your FIRA to instantly see how much you're overpaying on FX fees.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors duration-200",
            isDragging ? "border-primary bg-primary/10" : "hover:border-primary/50 hover:bg-muted"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            name="firaDocument"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            required
          />
          {file ? (
            <div className="flex flex-col items-center gap-2 text-foreground">
              <FileText className="h-12 w-12 text-primary" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive hover:bg-destructive/10 hover:text-destructive z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Remove file
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadCloud className="h-12 w-12" />
              <p className="font-medium text-foreground">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm">PDF, PNG, or JPEG (Max 10MB)</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>Your data is processed securely and is never stored.</span>
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton hasFile={!!file} />
      </CardFooter>
    </Card>
  );
}
