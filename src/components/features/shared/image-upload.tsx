"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/services/api";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  directory?: string;
}

export function ImageUpload({
  value,
  onChange,
  className,
  directory = "misc",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // Preview locally
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to API
        const res = await uploadFile(file, directory);
        onChange(res.url || res.key);
      } catch (error) {
        console.error("Upload failed", error);
        // Still keep preview if local mock
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 p-6 transition-colors hover:bg-muted/60",
        className,
      )}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-xs text-muted-foreground">Uploading image...</p>
        </div>
      ) : preview ? (
        <div className="relative w-full h-32 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-h-full max-w-full rounded-md object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 rounded-full shadow-md"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground/80 mb-2" />
          <p className="text-xs font-medium text-foreground">
            Click to upload institution logo
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>
      )}
    </div>
  );
}
