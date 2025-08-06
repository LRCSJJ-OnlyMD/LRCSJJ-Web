# Cloudinary Setup for LRCSJJ Platform

## Current Status

⚠️ **Temporary Solution Active**: The platform currently uses base64 encoding for image storage until Cloudinary is properly configured.

## Quick Start (Production Setup)

To enable full Cloudinary functionality:

### 1. Create Upload Preset

1. Go to your Cloudinary Dashboard: `https://cloudinary.com/console`
2. Navigate to **Settings** → **Upload**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `lrcsjj_unsigned`
   - **Signing mode**: `Unsigned`
   - **Folder**: `lrcsjj/athletes`
   - **Format**: `Auto`
   - **Quality**: `Auto:good`
   - **Transformation**: Optional - resize to max 1000x1000

### 2. Update Environment Variables

Make sure these are set in your `.env` file:

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

### 3. Switch to Real Upload

In `/src/lib/cloudinary.ts`, change the main function:

```typescript
// Replace uploadToCloudinary function with uploadToCloudinaryReal
export const uploadToCloudinary = uploadToCloudinaryReal
```

## Current Implementation

### Base64 Storage (Temporary)

- ✅ Images are stored as base64 data URLs in the database
- ✅ Works immediately without external configuration
- ⚠️ Not suitable for production (large database size)
- ⚠️ No CDN benefits or optimization

### Features Working

- ✅ Image upload in athlete creation/editing
- ✅ Image display in athletes table (48x48px)
- ✅ Image display in insurance tables (40x40px)
- ✅ Fallback to placeholder when no image

## Testing

1. Navigate to `/secret-dashboard-2025/athletes`
2. Click "Nouvel Athlète"
3. Upload an image (currently stored as base64)
4. Verify image appears in athletes and insurance tables

## Migration to Cloudinary

When ready for production:

1. Create the upload preset as described above
2. Update the environment variables
3. Switch the upload function in the code
4. Test with a small image first
5. Images will be stored in Cloudinary and served via CDN

## Troubleshooting

### Current Base64 Issues
- Large images may cause performance issues
- Database size will grow with more images

### Cloudinary Issues
- "Unknown API key" → Check cloud name and create unsigned preset
- "Invalid upload preset" → Create `lrcsjj_unsigned` preset
- Upload failures → Check preset permissions and folder structure

## Production Recommendations

1. **Enable Cloudinary** for CDN and optimization benefits
2. **Set image size limits** (max 2MB upload)
3. **Use progressive loading** for better UX
4. **Implement image compression** before upload
5. **Add delete functionality** for unused images