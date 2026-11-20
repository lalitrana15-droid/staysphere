"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

function sized(url: string, w: number) {
  return `${url}?w=${w}`;
}

function GalleryImage({
  src,
  alt,
  fill,
  priority,
  className,
  sizes,
  loading,
  onError,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  onError?: () => void;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      loading={loading}
      unoptimized
      onError={() => { setErrored(true); onError?.(); }}
    />
  );
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [erroredIndices, setErroredIndices] = useState<Set<number>>(new Set());

  const markErrored = (idx: number) =>
    setErroredIndices((prev) => new Set([...prev, idx]));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    setAlbumOpen(false);
  };

  const prev = useCallback(
    () => setCurrentIndex((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setCurrentIndex((c) => (c + 1) % images.length),
    [images.length]
  );

  // Keyboard nav in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next]);

  // Lock body scroll when album or lightbox open
  useEffect(() => {
    document.body.style.overflow = albumOpen || lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [albumOpen, lightboxOpen]);

  const visibleImages = images.filter((_, i) => !erroredIndices.has(i));

  return (
    <>
      {/* ── Preview Grid: 1 main + 4 thumbnails ── */}
      <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[500px]">
        {/* Main image */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <GalleryImage
            src={sized(images[0], 1200)}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* 4 thumbnails */}
        {images.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(idx + 1)}
          >
            <GalleryImage
              src={sized(img, 800)}
              alt={`${title} ${idx + 2}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

            {/* Last thumbnail overlay */}
            {idx === 3 && images.length > 5 && (
              <button
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1.5 hover:bg-black/60 transition-colors"
                onClick={(e) => { e.stopPropagation(); setAlbumOpen(true); }}
              >
                <Images className="w-5 h-5 text-white" />
                <span className="text-xs font-sans font-medium text-white tracking-wide">
                  +{images.length - 4} photos
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* View all button below grid */}
      {images.length > 5 && (
        <button
          onClick={() => setAlbumOpen(true)}
          className="mt-3 flex items-center gap-2 text-xs font-sans font-medium tracking-[0.1em] uppercase text-charcoal/50 dark:text-ivory/50 hover:text-charcoal dark:hover:text-ivory transition-colors"
        >
          <Images className="w-3.5 h-3.5" />
          View all {images.length} photos
        </button>
      )}

      {/* ── Album View (Lost Traveller style) ── */}
      {albumOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#0a0a0a] overflow-y-auto">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 flex items-center gap-4 px-4 py-3 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setAlbumOpen(false)}
              className="flex items-center gap-1.5 text-sm font-sans text-charcoal/60 dark:text-ivory/60 hover:text-charcoal dark:hover:text-ivory transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-sm font-sans text-charcoal/40 dark:text-ivory/40">
              {visibleImages.length} photos
            </span>
          </div>

          {/* Masonry grid — natural image heights */}
          <div className="columns-2 md:columns-3 gap-0.5 p-0.5">
            {images.map((img, idx) => {
              if (erroredIndices.has(idx)) return null;
              return (
                <div
                  key={idx}
                  className="break-inside-avoid mb-0.5 cursor-pointer overflow-hidden group"
                  onClick={() => openLightbox(idx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sized(img, 800)}
                    alt={`${title} photo ${idx + 1}`}
                    loading={idx < 6 ? "eager" : "lazy"}
                    className="w-full block transition-transform duration-500 group-hover:scale-105"
                    onError={() => markErrored(idx)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <button
              onClick={() => { setLightboxOpen(false); setAlbumOpen(true); }}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-sans transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              All photos
            </button>
            <span className="text-white/50 text-xs font-sans">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center relative min-h-0 px-14">
            <div className="relative w-full h-full">
              <GalleryImage
                src={sized(images[currentIndex], 1600)}
                alt={`${title} photo ${currentIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Nav */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}
