// hooks/useVideoUpload.ts
import { useCallback, useState } from "react";
import {
  uploadViolationVideo,
  validateVideoFile,
  VideoValidationError,
} from "../../lib/services/upload";

export type UploadStatus = "uploading" | "completed" | "error";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: UploadStatus;
  location: string;
  errorMessage?: string;
}

export function useVideoUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const uploadFiles = useCallback((fileList: FileList, location: string) => {
    Array.from(fileList).forEach((file) => {
      const id = `${Date.now()}-${Math.random()}`;

      try {
        validateVideoFile(file);
      } catch (err) {
        setFiles((prev) => [
          ...prev,
          {
            id,
            name: file.name,
            size: file.size,
            status: "error",
            location,
            errorMessage:
              err instanceof VideoValidationError ? err.message : "Invalid file.",
          },
        ]);
        return;
      }

      setFiles((prev) => [
        ...prev,
        { id, name: file.name, size: file.size, status: "uploading", location },
      ]);

      uploadViolationVideo(file, location)
        .then(() => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: "completed" } : f))
          );
        })
        .catch((err) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    status: "error",
                    errorMessage: err instanceof Error ? err.message : "Upload failed.",
                  }
                : f
            )
          );
        });
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { files, uploadFiles, removeFile };
}