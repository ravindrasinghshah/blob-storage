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
      console.log(file);
      setIsUploading(true);
      setUploadError(null);
      try {
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: "POST",
          body: file,
        });

        const newBlob = (await response.json()) as { url: string };

        setBlobUrl(newBlob.url);
      } catch (error) {
        setUploadError(error as string);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
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
  );
}

export default FileUpload;
