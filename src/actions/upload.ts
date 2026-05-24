"use server";

import { uploadImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/services/admin";

export type UploadState = { ok: boolean; url?: string; error?: string };

/** Admin-guarded image upload to Cloudinary. Returns the delivery URL. */
export async function uploadImageAction(
  formData: FormData,
): Promise<UploadState> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "File must be an image." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "Image must be under 8 MB." };
  }

  try {
    const url = await uploadImage(file);
    return { ok: true, url };
  } catch {
    return { ok: false, error: "Upload failed. Check your Cloudinary keys." };
  }
}
