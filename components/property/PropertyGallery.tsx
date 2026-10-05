"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const prev = () => setCurrentIndex((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((c) => (c + 1) % images.length);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px]">
        {/* Main Image */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Secondary Images */}
        {images.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className={cn(
              "relative overflow-hidden cursor-pointer group",
              idx === 3 && "relative"
            )}
            onClick={() => openLightbox(idx + 1)}
          >
            <Image
              src={img}
              alt={`${title} ${idx + 2}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Show All Button on last image */}
            {idx === 3 && images.length > 5 && (
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(4);
                }}
              >
                <div className="flex items-center gap-2 text-white">
                  <Grid className="w-4 h-4" />
                  <span className="text-sm font-sans font-medium">
                    +{images.length - 4} more
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-3"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl aspect-[16/10] px-16">
            <Image
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            onClick={next}
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-3"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-sans">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
