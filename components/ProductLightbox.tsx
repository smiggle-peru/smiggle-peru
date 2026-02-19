"use client";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Img = { src: string; alt?: string };

export default function ProductLightbox({
  open,
  onClose,
  images,
  index,
  onIndexChange,
}: {
  open: boolean;
  onClose: () => void;
  images: Img[];
  index: number;
  onIndexChange: (i: number) => void;
}) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={images}
      plugins={[Thumbnails, Zoom]}
      on={{ view: ({ index }) => onIndexChange(index) }}
      styles={{
        container: { backgroundColor: "#fff" }, // fondo blanco
        button: { filter: "none" },
        icon: { color: "#000" }, // iconos negros
      }}
      thumbnails={{
        position: "bottom",
        width: 72,
        height: 72,
        border: 2,
        padding: 2,
        gap: 10,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
        zoomInMultiplier: 1.2,
      }}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: false }}
      animation={{ fade: 120, swipe: 220 }}
    />
  );
}
