import { useRef, useState } from "react";
import "./CarouselMin.css";
import { data } from "../utils/carouselMin";

const buildSrc = (url, width, quality = 75) =>
  `${url}?w=${width}&auto=format&fit=crop&q=${quality}`;

export default function Carousel() {
  const ref = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);

  const scroll = (dir) => {
    const w = ref.current.offsetWidth;
    ref.current.scrollBy({
      left: dir === "next" ? w * 0.8 : -w * 0.8,
      behavior: "smooth",
    });
  };

  // Mouse
  const onMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setDragStartScrollLeft(ref.current.scrollLeft);
  };
  const onMouseLeave = () => setIsDown(false);
  const onMouseUp = () => setIsDown(false);
  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = dragStartScrollLeft - (x - startX) * 1.5;
  };

  // Touch
  const onTouchStart = (e) => {
    setIsDown(true);
    setStartX(e.touches[0].pageX - ref.current.offsetLeft);
    setDragStartScrollLeft(ref.current.scrollLeft);
  };
  const onTouchEnd = () => setIsDown(false);
  const onTouchMove = (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = dragStartScrollLeft - (x - startX) * 1.5;
  };

  return (
    <div className="sorel-carousel-wrapper">
      <button
        className="sorel-carousel-btn sorel-carousel-prev"
        onClick={() => scroll("prev")}
      >
        ‹
      </button>

      <div
        className="sorel-carousel"
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
      >
        {data.map((item, i) => (
          <div className="sorel-carousel-card" key={item.title}>
            <picture>
              {/* Cloudinary: f_auto elige WebP/AVIF automáticamente */}
              <source
                type="image/webp"
                srcSet={`
                  ${buildSrc(item.src, 320, 70)} 320w,
                  ${buildSrc(item.src, 640, 75)} 640w,
                  ${buildSrc(item.src, 960, 80)} 960w
                `}
                sizes="(max-width: 480px) 320px, (max-width: 768px) 640px, 960px"
              />
              <img
                src={buildSrc(item.src, 640)}
                srcSet={`
                  ${buildSrc(item.src, 320, 70)} 320w,
                  ${buildSrc(item.src, 640, 75)} 640w
                `}
                sizes="(max-width: 480px) 320px, 640px"
                alt={item.title}
                width={640}
                height={840}
                loading={i === 0 ? "eager" : "lazy"} // primera eager, resto lazy
              />
            </picture>
            <div className="sorel-carousel-overlay" />
            <div className="sorel-carousel-content">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="sorel-carousel-btn sorel-carousel-next"
        onClick={() => scroll("next")}
      >
        ›
      </button>
    </div>
  );
}
