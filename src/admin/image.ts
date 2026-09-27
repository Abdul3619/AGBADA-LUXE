const MAX_EDGE = 2000;
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_INPUT_BYTES = 40 * 1024 * 1024;

/**
 * Resizes a photo to at most 2000px on its longest side and re-encodes it as JPEG. This keeps uploads well under
 * the 5 MB storage limit, makes the site fast, and strips camera metadata such as GPS location.
 */
export async function prepareImage(file: File): Promise<{ blob: Blob; extension: string; width: number; height: number }> {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
    throw new Error('Please choose a JPEG, PNG, WebP or AVIF image.');
  }
  if (file.size > MAX_INPUT_BYTES) throw new Error('That file is too large. Please choose an image under 40 MB.');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('This image could not be read. Please try a different file.');
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not process this image.');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  for (const quality of [0.86, 0.78, 0.68]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (blob && blob.size <= MAX_BYTES) return { blob, extension: 'jpg', width, height };
  }
  throw new Error('This image is too detailed to upload. Please try a smaller version.');
}
