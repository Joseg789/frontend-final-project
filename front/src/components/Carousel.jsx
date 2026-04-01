import "./Carousel.css";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1600&q=80&auto=format&fit=crop",
    title: "Conquer the Cold",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1678481645253-093d2d5553db?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Made for the City",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop",
    title: "Built to Last",
  },

  {
    id: 5,
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&q=80&auto=format&fit=crop",
    title: "Designed for Movement",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    title: "Minimal Outfit",
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    title: "City Vibes",
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    title: "Fashion Week",
  },
  {
    id: 9,
    img: "https://images.unsplash.com/photo-1475180098004-ca77a66827be",
    title: "Adventure Ready",
  },

  {
    id: 13,
    img: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=1600&q=80",
    title: "Cold Season",
  },
  {
    id: 14,
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80",
    title: "Winter Walk",
  },

  {
    id: 16,
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&q=80",
    title: "Street Mood",
  },
  {
    id: 17,
    img: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=1600&q=80",
    title: "Layered Style",
  },

  {
    id: 19,
    img: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=1600&q=80",
    title: "Urban Winter",
  },

  {
    id: 21,
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1600&q=80",
    title: "City Walk",
  },

  {
    id: 24,
    img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1600&q=80",
    title: "Minimal Street",
  },
];

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
    img.src = slides[nextIndex].img;
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
            src={slide.img}
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
