// When VITE_IMAGES_BASE_URL is set (a public R2/S3 bucket URL), images load
// directly from there — no backend involved, no credentials needed to view
// them. Otherwise falls back to the backend proxy route, which works with
// the local MinIO container out of the box.
const BASE_URL = import.meta.env.VITE_IMAGES_BASE_URL

export function getImageUrl(imageName: string): string {
  if (!imageName) return ''
  return BASE_URL ? `${BASE_URL.replace(/\/$/, '')}/${imageName}` : `/uploads/${imageName}`
}
