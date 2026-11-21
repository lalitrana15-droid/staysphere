"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images, BadgeCheck } from "lucide-react";
import { filterPropertyImages, sizedImage } from "@/lib/image-utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

function sized(url: string, w: number) {
  return sizedImage(url, w);
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

export function PropertyGallery({ images: rawImages, title }: PropertyGalleryProps) {
  const images = filterPropertyImages(rawImages);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainIdx, setMainIdx] = useState(0);
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
      {/* ── Preview Grid: big main image (with arrows) + 5 tiles ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[420px] lg:h-[480px] rounded-2xl overflow-hidden">
        {/* Main image */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => setAlbumOpen(true)}
        >
          <GalleryImage
            key={mainIdx}
            src={sized(images[mainIdx] ?? images[0], 1200)}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="50vw"
          />
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-charcoal text-xs font-sans font-medium shadow">
            <BadgeCheck className="w-4 h-4 text-gold-600" /> Verified Villa
          </span>
          {images.length > 1 && (
            <>
              <button
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); setMainIdx((i) => (i - 1 + images.length) % images.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-charcoal hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); setMainIdx((i) => (i + 1) % images.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-charcoal hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/55 text-white text-xs font-sans backdrop-blur-sm">
                <Images className="w-3.5 h-3.5" /> {mainIdx + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* Tiles: 2 on top, 3 below */}
        <div className="hidden lg:grid grid-cols-6 grid-rows-2 gap-2">
          {images.slice(1, 6).map((img, idx) => {
            const isLast = idx === 4 || (idx === images.slice(1, 6).length - 1 && images.length > 6);
            return (
              <div
                key={idx}
                className={`relative overflow-hidden cursor-pointer group ${idx < 2 ? "col-span-3" : "col-span-2"}`}
                onClick={() => setAlbumOpen(true)}
              >
                <GalleryImage
                  src={sized(img, 700)}
                  alt={`${title} ${idx + 2}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {isLast && images.length > 6 && (
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5 text-white">
                    <Images className="w-6 h-6" />
                    <span className="text-sm font-sans font-medium">View All Photos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
              onClick={() => { setLightboxOpen(false); setTimeout(() => setAlbumOpen(true), 50); }}
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
