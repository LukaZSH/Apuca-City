
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Image, X } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ onImagesChange, maxImages = 3 }: ImageUploadProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addImages(files);
  };

  const addImages = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isImage && isValidSize;
    });

    if (images.length + validFiles.length > maxImages) {
      alert(`Você pode adicionar no máximo ${maxImages} imagens`);
      return;
    }

    const updatedImages = [...images, ...validFiles];
    setImages(updatedImages);
    onImagesChange(updatedImages);

    // Criar previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraCapture}
          className="flex-1"
          disabled={images.length >= maxImages}
        >
          <Camera className="w-4 h-4 mr-2" />
          Câmera
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleGallerySelect}
          className="flex-1"
          disabled={images.length >= maxImages}
        >
          <Image className="w-4 h-4 mr-2" />
          Galeria
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        {images.length}/{maxImages} imagens • Máximo 5MB por imagem
      </p>
    </div>
  );
};

export default ImageUpload;
