import { useRef, useState } from "react";
import "./CarouselMin.css";
import { data } from "../utils/carouselMin";

export default function Carousel() {
  const ref = useRef(null);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0); // ✅ Issue 1

  const scroll = (dir) => {
    const width = ref.current.offsetWidth;
    ref.current.scrollBy({
      left: dir === "next" ? width * 0.8 : -width * 0.8,
      behavior: "smooth",
    });
  };

  // Mouse events
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setDragStartScrollLeft(ref.current.scrollLeft); // ✅ Issue 1
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = dragStartScrollLeft - walk; // ✅ Issue 1
  };

  // Touch events                                         // ✅ Issue 3
  const handleTouchStart = (e) => {
    setIsDown(true);
    setStartX(e.touches[0].pageX - ref.current.offsetLeft);
    setDragStartScrollLeft(ref.current.scrollLeft);
  };
  const handleTouchEnd = () => setIsDown(false);
  const handleTouchMove = (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = dragStartScrollLeft - walk;
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
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart} // ✅ Issue 3
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {data.map((item) => (
          <div className="sorel-carousel-card" key={item.title}>
            {" "}
            {/* ✅ Issue 4 */}
            <img src={item.src} alt={item.title} />
            <div className="sorel-carousel-overlay"></div>
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
