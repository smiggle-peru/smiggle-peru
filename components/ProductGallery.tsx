"use client";

import { useMemo, useState } from "react";
import ProductLightbox from "./ProductLightbox";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title?: string;
}) {
  const slides = useMemo(
    () => images.map((src) => ({ src, alt: title || "Imagen del producto" })),
    [images, title]
  );

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (!images?.length) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg grid place-items-center text-sm text-gray-500">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Imagen principal */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full"
        aria-label="Abrir zoom"
      >
        <img
          src={images[index]}
          alt={title || "Imagen del producto"}
          className="w-full h-auto rounded-xl cursor-zoom-in"
        />
      </button>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`shrink-0 rounded-lg border ${
                i === index ? "border-black" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt={`Miniatura ${i + 1}`}
                className="h-16 w-16 object-cover rounded-lg"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <ProductLightbox
        open={open}
        onClose={() => setOpen(false)}
        images={slides}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
}
