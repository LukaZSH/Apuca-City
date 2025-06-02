
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, bucket: string, folder?: string): Promise<{ url: string | null; error: any }> => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        return { url: null, error: uploadError };
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error };
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
};
