"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type BlobProp = {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

function Gallery() {
  const [blobs, setBlobs] = useState<BlobProp[]>([]);

  useEffect(() => {
    const fetchBlobUrls = async () => {
      const response = await fetch(`/api/get-blobs`);
      if (!response.ok) {
        throw new Error("Failed to fetch blobs");
      }
      const data = (await response.json()) as BlobProp[];
      setBlobs(data.map((blob) => blob));
    };
    fetchBlobUrls();
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
      {blobs.map((blob) => (
        <div key={blob.url} className="w-[200px] h-[200px]">
          <Image
            key={blob.url}
            src={blob.url}
            title={blob.url}
            alt={blob.url}
            className="w-full h-full object-cover"
            loading="lazy"
            width={200}
            height={200}
          />
          {/**toolttip to show metadata of the blob */}
          <div
            title={JSON.stringify(blob)}
            className="cursor-pointer bg-amber-200 w-5 h-5 rounded-full flex items-center justify-center mt-1"
          >
            ?
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
