import React, { useState, useEffect } from "react";
import { Upload, X, FileImage, Plus, Trash2 } from "lucide-react";

interface ImageUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value.length > 0) {
      const urls = value.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [value]);

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).slice(0, maxFiles);
    const newFiles = multiple
      ? [...value, ...fileArray].slice(0, maxFiles)
      : fileArray;
    onChange?.(newFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesChange(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange?.(newFiles);
  };

  const clearSingleImage = () => {
    onChange?.([]);
  };

  // Render cho upload đơn với preview trong khung
  if (!multiple) {
    const hasImage = previews.length > 0;

    return (
      <div className="w-full">
        <div
          className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : hasImage
              ? "border-gray-300 hover:border-gray-400"
              : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="single-image-upload"
          />

          {hasImage ? (
            // Preview state
            <div className="relative group">
              <div className="aspect-video min-h-[200px]">
                <img
                  src={previews[0]}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSingleImage();
                }}
                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-20"
                title="Xóa ảnh"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              {/* Change Image Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="text-center text-white">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Thay đổi ảnh</p>
                  <p className="text-xs opacity-80">Click hoặc kéo thả</p>
                </div>
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-sm text-white truncate">{value[0]?.name}</p>
                <p className="text-xs text-gray-300">
                  {Math.round((value[0]?.size || 0) / 1024)} KB
                </p>
              </div>
            </div>
          ) : (
            // Empty state
            <div className="p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className={`p-4 rounded-full mb-4 transition-colors ${
                    isDragging ? "bg-blue-100" : "bg-gray-200"
                  }`}
                >
                  {isDragging ? (
                    <Upload
                      className={`w-10 h-10 ${
                        isDragging ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                  ) : (
                    <FileImage className="w-10 h-10 text-gray-500" />
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-700">
                    {isDragging ? "Thả ảnh tại đây" : "Tải lên hình ảnh"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Kéo thả hoặc click để chọn file
                  </p>
                  <p className="text-xs text-gray-400">Hỗ trợ JPG, PNG, GIF</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render cho upload nhiều ảnh (giữ nguyên logic cũ)
  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-5 transition-all duration-300 ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="image-upload"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className={`p-3 rounded-full mb-4 transition-colors ${
              isDragging ? "bg-blue-100" : "bg-gray-200"
            }`}
          >
            {isDragging ? (
              <Upload
                className={`w-8 h-8 ${
                  isDragging ? "text-blue-600" : "text-gray-500"
                }`}
              />
            ) : (
              <FileImage className="w-8 h-8 text-gray-500" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-700">
              {isDragging ? "Thả ảnh tại đây" : "Tải lên hình ảnh"}
            </p>
            <p className="text-sm text-gray-500">
              Kéo thả hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400">
              Hỗ trợ JPG, PNG, GIF (Tối đa {maxFiles} ảnh)
            </p>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Ảnh đã chọn ({previews.length}/{maxFiles})
            </h3>
            {multiple && previews.length < maxFiles && (
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm ảnh
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((src, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square">
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
                  title="Xóa ảnh"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-xs text-white truncate">
                    {value[index]?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
