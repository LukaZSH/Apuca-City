
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useStorage } from '@/hooks/useStorage';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onRemoveImage: (url: string) => void;
  images: string[];
  maxImages?: number;
  onImagesChange?: (files: File[]) => void;
}

const ImageUpload = ({ onImageUploaded, onRemoveImage, images, maxImages = 3, onImagesChange }: ImageUploadProps) => {
  const { uploadImage, uploading } = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Se onImagesChange foi fornecido, apenas atualiza o estado sem upload
    if (onImagesChange) {
      onImagesChange(fileArray);
      return;
    }

    // Caso contrário, faz o upload real
    for (let i = 0; i < files.length && images.length + i < maxImages; i++) {
      const file = files[i];
      
      try {
        const { url, error } = await uploadImage(file, 'problem-images');
        
        if (error) {
          console.error('Error uploading image:', error);
          continue;
        }

        if (url) {
          onImageUploaded(url);
        }
      } catch (error) {
        console.error('Error in handleImageUpload:', error);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    onRemoveImage(imageUrl);
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            {uploading ? 'Enviando...' : `Adicionar Foto${images.length < maxImages - 1 ? 's' : ''} (${images.length}/${maxImages})`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
