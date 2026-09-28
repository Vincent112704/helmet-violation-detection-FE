// services/videoService.ts
import { fetchApi } from "../../lib/api";

export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const ACCEPTED_VIDEO_TYPE = "video/mp4";
const DEV_MODE = 'http://localhost:8000';
const PROD_MODE = 'http://146.190.106.162'

export class VideoValidationError extends Error {}

export function validateVideoFile(file: File): void {
  const isMp4 =
    file.type === ACCEPTED_VIDEO_TYPE && file.name.toLowerCase().endsWith(".mp4");

  if (!isMp4) {
    throw new VideoValidationError("Only MP4 files are supported.");
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new VideoValidationError("File size must be less than 50MB.");
  }
}

export async function uploadViolationVideo(
  file: File,
  location: string
): Promise<void> {
  validateVideoFile(file);

  const formData = new FormData();
  formData.append("video_file", file); // must match FastAPI's `video_file` param name
  formData.append("location", location); // read server-side via request.form()

  await fetchApi(`${PROD_MODE}/api/upload/`, "POST", formData);
  // Fire-and-forget from the client's perspective — backend processes
  // in a background task and returns nothing meaningful to parse.
}