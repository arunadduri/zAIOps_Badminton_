# Supabase Storage Setup Guide

Follow these steps to set up Supabase Storage for your gallery:

## Step 1: Create Storage Bucket

1. Go to https://supabase.com/dashboard
2. Select your project: `yvzfnotfpmoitzyljbfd`
3. Click **"Storage"** in the left sidebar
4. Click **"New bucket"** button
5. Enter bucket details:
   - **Name**: `gallery-images`
   - **Public bucket**: ✅ Check this (so images are publicly accessible)
   - Click **"Create bucket"**

## Step 2: Set Bucket Policies (Important!)

After creating the bucket, we need to allow public access:

1. Click on the `gallery-images` bucket
2. Click **"Policies"** tab at the top
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Add this policy:

**Policy Name**: `Public Access`

**Policy Definition**:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery-images' );
```

Or use the **"Get started quickly"** option and select:
- ✅ **SELECT** (Allow public to read)
- Target roles: `public`

6. Click **"Review"** then **"Save policy"**

## Step 3: Upload Your Existing Images

1. In the `gallery-images` bucket, click **"Upload file"**
2. Select all images from your `Photos/` folder
3. Upload them (you can drag & drop multiple files)

## Step 4: Verify Setup

After uploading, you should see your images in the bucket. Click on any image to get its public URL - it should look like:
```
https://yvzfnotfpmoitzyljbfd.supabase.co/storage/v1/object/public/gallery-images/IMG_4101.jpg
```

## Step 5: Update Your Website

Once the bucket is set up, I'll update the code to fetch images from Supabase Storage instead of the local Photos folder.

---

## Quick Reference

**Bucket Name**: `gallery-images`
**Bucket Type**: Public
**Your Supabase URL**: `https://yvzfnotfpmoitzyljbfd.supabase.co`

---

## Future Image Uploads

To add new images to the gallery:
1. Go to Supabase Dashboard → Storage → gallery-images
2. Click "Upload file"
3. Select your images
4. Images appear in gallery immediately! 🎉

No Git commits needed!