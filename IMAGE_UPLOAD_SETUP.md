# Image Upload & Auto-Deletion Setup Guide

## Environment Variables

Add the following to your `.env.local` file:

```env
# Existing Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API (existing)
GEMINI_API_KEY=your_gemini_api_key

# NEW: Cron Job Security
CRON_SECRET=your_random_secret_key_here
```

**Generate CRON_SECRET:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Simple UUID
uuidgen
```

---

## Supabase Storage Bucket Setup

### 1. Create Media Bucket

Go to Supabase Dashboard → Storage → Create Bucket:

```
Bucket Name: media
Public: Yes (for CDN access)
File Size Limit: 5MB
Allowed MIME types: image/*
```

### 2. Apply Storage Policies

Run the SQL from `supabase/storage_policies.sql`:

```sql
-- Allow public access to media bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow authenticated users to upload to media bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND
  auth.role() = 'authenticated'
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND
  auth.uid() = owner
);
```

### 3. Create Folder Structure

In Supabase Storage → media bucket, create:
- `posts/` folder (for post images)

---

## Vercel Deployment Setup

### 1. Environment Variables

Add to Vercel Dashboard → Project → Settings → Environment Variables:

```
CRON_SECRET = [your generated secret]
```

(Other env vars should already be set)

### 2. Verify Cron Jobs

After deployment, check:
- Vercel Dashboard → Deployments → [Your Deployment] → Cron Jobs
- Should see: `/api/cron/cleanup-posts` scheduled for `0 2 * * *` (daily 2 AM UTC)

### 3. Test Cron Endpoint (Local)

```bash
# Test cleanup endpoint
curl -X GET http://localhost:3000/api/cron/cleanup-posts \
  -H "Authorization: Bearer your_cron_secret_here"

# Expected response:
{
  "message": "No posts to cleanup",
  "count": 0
}
```

---

## Usage

### For Users

1. **Create Post with Image:**
   - Write your post
   - Click image icon (📷)
   - Select image (max 5MB)
   - See preview
   - Click "Gönder"

2. **Image Optimization:**
   - Automatic WebP conversion
   - Lazy loading
   - Responsive images
   - CDN caching

3. **Auto-Deletion:**
   - Posts with images are deleted after **24 HOURS**
   - Images are removed from storage
   - Automatic cleanup runs daily at 2 AM UTC

### File Size Limits

- **Max Upload:** 5MB per image
- **Recommended:** 1-2MB for best performance
- **Format:** Any image format (will be converted to WebP)

---

## Storage Calculation

**Example:**
- 100 users
- 5 posts/day with images
- Average: 500KB after optimization

**Daily:** 500 images × 0.5MB = 250MB  
**24-Hour Rolling:** Max 250MB storage  
**Monthly Throughput:** ~7.5GB (auto-deleted)

**Supabase Free Tier:** 1GB storage ✅ **PERFECT!**

**Supabase Plans:**
- Free: 1GB ✅ Sufficient with 24-hour cleanup
- Pro: 100GB ($25/month) - Not needed

**With 24-hour cleanup:**
- Max storage: ~250MB (well under 1GB limit)
- Free tier is sufficient
- No paid plan needed! 🎉

---

## Monitoring

### Check Cleanup Logs

Vercel Dashboard → Functions → `/api/cron/cleanup-posts` → Logs

Look for:
```json
{
  "success": true,
  "deletedPosts": 10,
  "deletedImages": 10,
  "timestamp": "2025-12-05T02:00:00Z"
}
```

### Storage Usage

Supabase Dashboard → Storage → media → Usage

Monitor:
- Total files
- Total size
- Growth rate

---

## Troubleshooting

### "Görsel yüklenemedi"

1. Check Supabase bucket exists: `media`
2. Check storage policies are applied
3. Check network tab for errors
4. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct

### Images not showing

1. Check `next.config.ts` has Supabase domain
2. Restart dev server after config change
3. Check browser console for errors

### Cron not running

1. Verify `CRON_SECRET` in Vercel env vars
2. Check Vercel plan (Cron requires Pro)
3. Check cron logs in Vercel dashboard

---

## Security Notes

1. **CRON_SECRET:** Keep secret, never commit
2. **Storage policies:** Authenticated uploads only
3. **File validation:** Client + server-side
4. **Public URLs:** Images are publicly accessible (by design)

---

## Development

### Test Image Upload (Local)

1. Start dev server: `npm run dev`
2. Login to app
3. Create post with image
4. Check Network tab for upload
5. Verify image appears in feed

### Test Cron (Local)

```bash
# Install curl or use Postman
curl -X GET http://localhost:3000/api/cron/cleanup-posts \
  -H "Authorization: Bearer test-secret"
```

---

## Next Steps

After deployment:
1. ✅ Verify image uploads work
2. ✅ Check images display with next/image
3. ✅ Monitor storage usage
4. ✅ Set up alerts for storage limits
5. ✅ Consider CDN for images (Cloudflare)
