import { useState } from 'react';
import { uploadCourseMaterial, deleteCourseMaterial, getCourseMaterials } from '@/lib/supabase/storage';
import { toast } from 'sonner';

interface Material {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

export function useCourseMaterials(courseId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);

  const uploadMaterial = async (file: File) => {
    setIsUploading(true);
    try {
      const material = await uploadCourseMaterial(file, courseId);
      setMaterials((prev) => [...prev, material]);
      toast.success('Material uploaded successfully');
      return material;
    } catch (error) {
      console.error('Error uploading material:', error);
      toast.error('Failed to upload material');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMaterial = async (path: string) => {
    try {
      await deleteCourseMaterial(path);
      setMaterials((prev) => prev.filter((m) => m.path !== path));
      toast.success('Material deleted successfully');
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
      throw error;
    }
  };

  const loadMaterials = async () => {
    try {
      const data = await getCourseMaterials(courseId);
      setMaterials(data as Material[]);
    } catch (error) {
      console.error('Error loading materials:', error);
      toast.error('Failed to load materials');
      throw error;
    }
  };

  return {
    materials,
    isUploading,
    uploadMaterial,
    deleteMaterial,
    loadMaterials
  };
}