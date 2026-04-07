import "./Carousel.css";

import { useEffect, useState } from "react";
import { slides } from "../utils/data";

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // autoplay con storytelling (primer slide dura más)
  useEffect(() => {
    if (paused) return;

    const duration = current === 0 ? 5000 : 3000;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [current, paused]);

  // preload siguiente imagen
  useEffect(() => {
    const nextIndex = (current + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].src;
  }, [current]);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === current ? "active" : ""}`}
        >
          <img
            src={slide.src}
            alt={slide.title}
            loading={index === 0 ? "eager" : "lazy"}
          />

          <div className="content">
            <h2>{slide.title}</h2>
          </div>
        </div>
      ))}

      {/* dots */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === current ? "dot active" : "dot"}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}
