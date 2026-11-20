"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

function GalleryImage({
  src,
  alt,
  fill,
  priority,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
        <span className="text-xs text-stone-400">Photo unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      unoptimized
      onError={() => setErrored(true)}
    />
  );
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    setGridOpen(false);
  };

  const prev = useCallback(
    () => setCurrentIndex((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setCurrentIndex((c) => (c + 1) % images.length),
    [images.length]
  );

  return (
    <>
      {/* Gallery Grid — 1 main + 4 thumbnails */}
      <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[500px]">
        {/* Main Image */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <GalleryImage
            src={images[0]}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* 4 secondary thumbnails */}
        {images.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(idx + 1)}
          >
            <GalleryImage
              src={img}
              alt={`${title} photo ${idx + 2}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* "View all photos" overlay on last thumbnail */}
            {idx === 3 && images.length > 5 && (
              <button
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 hover:bg-black/60 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setGridOpen(true);
                }}
              >
                <Grid3x3 className="w-5 h-5 text-white" />
                <span className="text-xs font-sans font-medium text-white tracking-wide">
                  +{images.length - 4} photos
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* All Photos Grid Modal */}
      {gridOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm">
            <span className="text-white font-sans text-sm">
              {title} — {images.length} photos
            </span>
            <button
              onClick={() => setGridOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-7xl mx-auto">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square cursor-pointer overflow-hidden group"
                onClick={() => openLightbox(idx)}
              >
                <GalleryImage
                  src={img}
                  alt={`${title} photo ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <span className="text-white/60 text-sm font-sans">
              {currentIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setLightboxOpen(false); setGridOpen(true); }}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-sans transition-colors"
              >
                <Grid3x3 className="w-4 h-4" />
                All photos
              </button>
              <button
                onClick={() => setLightboxOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center relative px-16 min-h-0">
            <div className="relative w-full h-full max-w-5xl">
              <GalleryImage
                src={images[currentIndex]}
                alt={`${title} photo ${currentIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Nav buttons */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-3"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-3"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Thumbnail strip */}
          <div className="flex-shrink-0 flex gap-1.5 overflow-x-auto px-4 py-3 bg-black/50">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-14 h-10 overflow-hidden transition-all ${
                  idx === currentIndex ? "ring-2 ring-gold-500 opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <GalleryImage
                  src={img}
                  alt={`thumb ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
