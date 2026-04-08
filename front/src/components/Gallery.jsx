import { useState, useEffect } from "react";
import "./gallery.css";
import { images } from "../utils/data";

// Construye URLs de Cloudinary con transformaciones automáticas
const buildCloudinaryUrl = (
  src,
  { width, quality = "auto", format = "auto" } = {},
) => {
  // src ya es una URL de Cloudinary: .../upload/v123/folder/image.jpg
  // Insertamos las transformaciones justo después de /upload/
  return src.replace(
    "/upload/",
    `/upload/f_${format},q_${quality}${width ? `,w_${width},c_fill` : ""}/`,
  );
};

const SIZES = {
  thumbnail: 400, // grid
  modal: 1200, // modal lightbox
};

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [loaded, setLoaded] = useState({});

  const currentIndex = images.findIndex((img) => img.id === selected?.id);
  const goNext = () => setSelected(images[(currentIndex + 1) % images.length]);
  const goPrev = () =>
    setSelected(images[(currentIndex - 1 + images.length) % images.length]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  // Teclado: Escape + flechas
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, currentIndex]);

  return (
    <>
      <div className="gallery">
        {images.map((img, index) => {
          const src400 = buildCloudinaryUrl(img.src, { width: 400 });
          const src800 = buildCloudinaryUrl(img.src, { width: 800 });

          return (
            <div className="card" key={img.id} onClick={() => setSelected(img)}>
              <picture>
                {/* AVIF — mejor compresión, navegadores modernos */}
                <source
                  type="image/avif"
                  srcSet={`
                    ${buildCloudinaryUrl(img.src, { width: 400, format: "avif" })} 400w,
                    ${buildCloudinaryUrl(img.src, { width: 800, format: "avif" })} 800w
                  `}
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
                {/* WebP — fallback amplio */}
                <source
                  type="image/webp"
                  srcSet={`
                    ${buildCloudinaryUrl(img.src, { width: 400, format: "webp" })} 400w,
                    ${buildCloudinaryUrl(img.src, { width: 800, format: "webp" })} 800w
                  `}
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
                {/* JPG — fallback universal */}
                <img
                  src={src400}
                  srcSet={`${src400} 400w, ${src800} 800w`}
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
                  alt={img.title}
                  width={400}
                  height={500}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding={index < 4 ? "sync" : "async"}
                  onLoad={() =>
                    setLoaded((prev) => ({ ...prev, [img.id]: true }))
                  }
                  className={`img${loaded[img.id] ? " loaded" : ""}`}
                />
              </picture>
              <div className="overlay">
                <h3>{img.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <button
            className="modal-btn modal-prev"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Anterior"
          >
            ‹
          </button>

          <picture>
            <source
              type="image/avif"
              srcSet={buildCloudinaryUrl(selected.src, {
                width: SIZES.modal,
                format: "avif",
              })}
            />
            <source
              type="image/webp"
              srcSet={buildCloudinaryUrl(selected.src, {
                width: SIZES.modal,
                format: "webp",
              })}
            />
            <img
              src={buildCloudinaryUrl(selected.src, { width: SIZES.modal })}
              alt={selected.title}
              width={1200}
              height={1500}
              decoding="async"
              onClick={(e) => e.stopPropagation()}
            />
          </picture>

          <button
            className="modal-btn modal-next"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Siguiente"
          >
            ›
          </button>

          <span className="modal-counter">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
