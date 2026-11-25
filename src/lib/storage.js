import { supabase } from './supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file, maxMb = 5) {
  if (!file) return 'No file selected.';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Only JPG, PNG, and WEBP images are allowed.';
  }
  const limit = maxMb * 1024 * 1024;
  if (file.size > limit) {
    return `File exceeds maximum allowed size of ${maxMb} MB.`;
  }
  return null;
}

export async function uploadImageToBucket(bucket, file, folder = '') {
  const maxMb = bucket === 'gallery-images' || bucket === 'homepage-slides' ? 8 : 5;
  const validationError = validateImageFile(file, maxMb);
  if (validationError) throw new Error(validationError);

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const path = folder ? `${folder}/${safeName}` : safeName;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message || 'Image upload failed.');

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImageFromBucketByUrl(bucket, publicUrl) {
  if (!publicUrl || !publicUrl.includes(`/storage/v1/object/public/${bucket}/`)) return;
  const parts = publicUrl.split(`/storage/v1/object/public/${bucket}/`);
  if (parts.length < 2) return;
  const filePath = decodeURIComponent(parts[1]);
  await supabase.storage.from(bucket).remove([filePath]);
}
