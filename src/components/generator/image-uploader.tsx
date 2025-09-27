import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from "@/lib/constants";

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
}

export function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      toast({
        title: "Upload Error",
        description: rejectedFiles[0].errors[0].message,
        variant: "destructive",
      });
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onFileSelect(file);
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
  });

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onFileSelect(null);
  };

  if (preview) {
    return (
      <div className="relative group w-full aspect-square border-2 border-dashed rounded-lg p-2">
        <img src={preview} alt="Image preview" className="absolute inset-0 w-full h-full object-cover rounded-md" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
          <Button variant="destructive" size="icon" onClick={removeImage}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full aspect-video border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="p-3 rounded-full bg-primary/10 mb-4">
        <UploadCloud className="h-8 w-8 text-primary" />
      </div>
      <p className="font-semibold">
        {isDragActive ? "Drop the image here..." : "Upload base character image"}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        PNG or JPG (max {MAX_FILE_SIZE_MB}MB, square recommended)
      </p>
    </div>
  );
}
