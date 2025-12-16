"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  mainImage: string | null;
  gallery: string[] | null;
  name: string;
}

export default function ProductGallery({
  mainImage,
  gallery,
  name,
}: ProductGalleryProps) {
  const images = [
    mainImage,
    ...(Array.isArray(gallery) ? gallery : []),
  ].filter(Boolean) as string[];

  // SAFETY: fallback if no images exist
  const [activeImage, setActiveImage] = useState<string>(
    images[0] ?? "/images/placeholder.png"
  );

  return (
    <div>
      {/* MAIN IMAGE */}
      <div className="bg-white border rounded-lg mb-4 flex items-center justify-center">
        <Image
          src={activeImage}
          alt={name}
          width={700}
          height={500}
          priority
          className="object-contain max-h-[420px] w-full"
        />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`border rounded-md p-1 bg-white transition
                ${
                  activeImage === img
                    ? "ring-2 ring-black"
                    : "hover:ring-1 hover:ring-gray-400"
                }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                width={80}
                height={80}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
