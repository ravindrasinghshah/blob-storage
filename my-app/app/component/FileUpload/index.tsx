"use client";

import Image from "next/image";
import { useRef, useState } from "react";

function FileUpload() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      setUploadError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });

        console.log("response", response);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Upload failed" }));
          throw new Error(
            errorData.error || `Upload failed with status ${response.status}`
          );
        }

        const newBlob = (await response.json()) as { url: string };

        setBlobUrl(newBlob.url);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        <input
          ref={inputFileRef}
          type="file"
          className="w-full border-2 border-gray-300 rounded-md p-2"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="flex flex-row items-center justify-center">
        {blobUrl && (
          <Image
            src={blobUrl}
            alt="Blob"
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        )}
      </div>
    </>
  );
}

export default FileUpload;
