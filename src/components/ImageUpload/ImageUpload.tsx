import React, { useState, useEffect } from "react";
import { useController, Control } from "react-hook-form";

interface ImageUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (value.length > 0) {
      const urls = value.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [value]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files).slice(0, maxFiles);
    onChange?.(fileArray);
  };

  const removeImage = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange?.(newFiles);
  };

  return (
    <div>
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleFilesChange}
        className="mb-2"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {previews.map((src, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={src}
              alt={`preview-${index}`}
              className="w-full h-full object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
