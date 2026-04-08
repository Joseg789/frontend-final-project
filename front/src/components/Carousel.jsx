import "./Carousel.css";
import { useEffect, useState } from "react";
import { slides } from "../utils/data";

//Cloudinary helpers para optimizar imagenes
const buildUrl = (src, { width, format = "auto", quality = "auto" } = {}) =>
  src.replace(
    "/upload/",
    `/upload/f_${format},q_${quality}${width ? `,w_${width},c_fill` : ""}/`,
  );

// Tamaños según breakpoint para el hero
const HERO_SIZES = "(max-width: 768px) 100vw, 100vw";

// ── Componente
export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Autoplay — primer slide dura más
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      current === 0 ? 5000 : 3000,
    );
    return () => clearTimeout(timer); // setTimeout > setInterval: no acumula desfases
  }, [current, paused]);

  // Preload del siguiente slide con URL optimizada de Cloudinary
  useEffect(() => {
    const next = slides[(current + 1) % slides.length];

    // Preload AVIF primero, luego WebP como fallback
    ["avif", "webp"].forEach((format) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = buildUrl(next.src, { width: 1920, format });
      link.type = `image/${format}`;
      document.head.appendChild(link);
      // Limpiar después de 6 s para no acumular tags
      setTimeout(() => link.remove(), 6000);
    });
  }, [current]);

  const goTo = (i) => setCurrent(i);
  const goPrev = () =>
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((p) => (p + 1) % slides.length);

  // Teclado
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Touch / swipe
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Carousel de imágenes"
      aria-live="polite"
    >
      {slides.map((slide, index) => {
        const isActive = index === current;
        const isAdjacent =
          index === (current + 1) % slides.length ||
          index === (current - 1 + slides.length) % slides.length;
        // Solo renderiza el slide activo y los adyacentes
        if (!isActive && !isAdjacent) return null;

        return (
          <div
            key={slide.id}
            className={`slide${isActive ? " active" : ""}`}
            aria-hidden={!isActive}
          >
            <picture>
              {/* AVIF — mejor compresión */}
              <source
                type="image/avif"
                srcSet={`
                  ${buildUrl(slide.src, { width: 768, format: "avif" })}  768w,
                  ${buildUrl(slide.src, { width: 1280, format: "avif" })} 1280w,
                  ${buildUrl(slide.src, { width: 1920, format: "avif" })} 1920w
                `}
                sizes={HERO_SIZES}
              />
              {/* WebP — fallback amplio */}
              <source
                type="image/webp"
                srcSet={`
                  ${buildUrl(slide.src, { width: 768, format: "webp" })}  768w,
                  ${buildUrl(slide.src, { width: 1280, format: "webp" })} 1280w,
                  ${buildUrl(slide.src, { width: 1920, format: "webp" })} 1920w
                `}
                sizes={HERO_SIZES}
              />
              {/* JPG — fallback universal */}
              <img
                src={buildUrl(slide.src, { width: 1280 })}
                srcSet={`
                  ${buildUrl(slide.src, { width: 768 })}  768w,
                  ${buildUrl(slide.src, { width: 1280 })} 1280w,
                  ${buildUrl(slide.src, { width: 1920 })} 1920w
                `}
                sizes={HERO_SIZES}
                alt={slide.title}
                width={1920}
                height={1080}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={index === 0 ? "high" : "low"}
              />
            </picture>

            <div className="content" aria-label={slide.title}>
              <h2>{slide.title}</h2>
            </div>
          </div>
        );
      })}

      {/* Controles prev / next */}
      <button
        className="carousel-btn carousel-prev"
        onClick={goPrev}
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        className="carousel-btn carousel-next"
        onClick={goNext}
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Dots */}
      <div className="dots" role="tablist" aria-label="Slides">
        {slides.map((slide, i) => (
          <span
            key={slide.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${slide.title}`}
            className={`dot${i === current ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
