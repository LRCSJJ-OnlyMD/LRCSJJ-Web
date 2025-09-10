// Client-side Cloudinary utilities for LRCSJJ platform
// This file only contains client-side functions to avoid Node.js module conflicts

import { logger } from "./logger";

// Simple base64 encoding for temporary solution
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Client-side upload function using Cloudinary's unsigned upload
export const uploadToCloudinary = async (file: File): Promise<string> => {
  // For now, let's use a simple base64 approach until Cloudinary is properly configured
  // This stores the image as base64 data URL (temporary solution)
  try {
    const base64 = await convertToBase64(file);

    // In a real scenario, you would upload to Cloudinary here
    // For now, we'll return the base64 data URL
    logger.debug("Using base64 storage", {
      feature: "image_upload",
      action: "base64_fallback",
      fileSize: file.size,
      fileType: file.type,
    });

    return base64;
  } catch (error) {
    logger.error("Image processing failed", {
      feature: "image_upload",
      action: "processing_error",
      fileName: file.name,
      fileSize: file.size,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error("Failed to process image");
  }
};

// Alternative Cloudinary upload (when properly configured)
export const uploadToCloudinaryReal = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "lrcsjj_unsigned"); // You need to create this preset
  formData.append("folder", "lrcsjj/athletes");

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "LRCSJJ";
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      logger.error("Cloudinary upload failed", {
        feature: "image_upload",
        action: "cloudinary_error",
        status: response.status,
        error: data,
      });
      throw new Error(
        `Upload failed: ${data.error?.message || "Unknown error"}`
      );
    }

    return data.secure_url;
  } catch (error) {
    logger.error("Cloudinary upload process failed", {
      feature: "image_upload",
      action: "upload_error",
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

// Helper function to optimize image URLs with Cloudinary transformations
export const getOptimizedImageUrl = (
  url: string,
  width = 150,
  height = 150
): string => {
  if (!url) return "/placeholder-avatar.svg";

  // If it's a base64 data URL, return as-is
  if (url.startsWith("data:")) return url;

  // If it's a Cloudinary URL, add transformations
  if (url.includes("cloudinary.com")) {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},h_${height},c_fill,f_auto,q_auto/${parts[1]}`;
    }
  }

  return url;
};

// Helper function to extract public ID from Cloudinary URL (for future deletion if needed)
export const getCloudinaryPublicId = (url: string): string | null => {
  if (!url || !url.includes("cloudinary.com")) return null;

  const matches = url.match(/\/([^/]+)\.(jpg|jpeg|png|gif|webp)$/);
  return matches ? matches[1] : null;
};
