import { supabase } from './client';
import { nanoid } from 'nanoid';

const COURSE_THUMBNAILS_BUCKET = 'course-thumbnails';
const COURSE_MATERIALS_BUCKET = 'course-materials';

export async function uploadCourseThumbnail(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${nanoid()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(COURSE_THUMBNAILS_BUCKET)
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(COURSE_THUMBNAILS_BUCKET)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadCourseMaterial(file: File, courseId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${nanoid()}.${fileExt}`;
  const filePath = `${courseId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(COURSE_MATERIALS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(COURSE_MATERIALS_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
    name: file.name,
    size: file.size,
    type: file.type
  };
}

export async function deleteCourseMaterial(path: string) {
  const { error } = await supabase.storage
    .from(COURSE_MATERIALS_BUCKET)
    .remove([path]);

  if (error) throw error;
}

export async function getCourseMaterials(courseId: string) {
  const { data, error } = await supabase.storage
    .from(COURSE_MATERIALS_BUCKET)
    .list(courseId);

  if (error) throw error;
  return data;
}