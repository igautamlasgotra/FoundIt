// Uploads an image straight from the browser to Cloudinary using an UNSIGNED
// preset — no secret key needed client-side. Returns the hosted secure URL,
// which is what we store in MongoDB. Vercel never touches the file bytes.
export async function uploadToCloudinary(file, { cloudName, uploadPreset }) {
  if (!cloudName || !uploadPreset) {
    throw new Error('Image uploads are not configured.');
  }

  const maxBytes = 8 * 1024 * 1024; // 8 MB guard before hitting the network
  if (file.size > maxBytes) {
    throw new Error('Image is too large (max 8 MB).');
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || 'Image upload failed. Please try again.');
  }
  return data.secure_url;
}
