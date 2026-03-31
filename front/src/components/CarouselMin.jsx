import React, { useRef, useState } from "react";
import "./CarouselMin.css";

const data = [
  {
    title: "Diseño indomable",
    text: "Estructura atrevida sin límites",
    img: "https://images.unsplash.com/photo-1610129303358-277a688b6417?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1vZGElMjBtb250YSVDMyVCMWF8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Modelado por la luz",
    text: "Diseñados para moverse",
    img: "https://images.unsplash.com/photo-1611336521720-4a565bef4ab9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fG1vZGElMjBtb250YSVDMyVCMWF8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Movimiento urbano",
    text: "Comodidad en cada paso",
    img: "https://images.unsplash.com/photo-1653303515724-93d9186151ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fG1vZGElMjBtb250YSVDMyVCMWF8ZW58MHx8MHx8fDA%3D",
  },

  {
    title: "Descubre tu escencia",
    text: "la comodidad que te define",
    img: "https://images.unsplash.com/photo-1496360600513-52e9febabbcd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAwfHxtb2RhJTIwbW9udGElQzMlQjFhfGVufDB8fDB8fHww",
  },
  {
    title: "Comparte tu estilo",
    text: "Tu estilo, tu historia",
    img: "https://images.unsplash.com/photo-1648564101688-2f9b16c4098a?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Disfruta el camino",
    text: "tu ritmo es único",
    img: "https://images.unsplash.com/photo-1725532605447-71287c35f380?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEzfHxtb2RhJTIwbW9udGElQzMlQjFhfGVufDB8fDB8fHww",
  },

  {
    title: "Exprésate sin límites",
    text: "tu estilo, tu voz",
    img: " https://images.unsplash.com/photo-1729023386944-ee27ead91b83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ2fHxtb2RhJTIwbW9udGElQzMlQjFhfGVufDB8fDB8fHww",
  },
];

export default function Carousel() {
  const ref = useRef(null);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // BOTONES
  const scroll = (dir) => {
    const width = ref.current.offsetWidth;
    ref.current.scrollBy({
      left: dir === "next" ? width * 0.8 : -width * 0.8,
      behavior: "smooth",
    });
  };

  // DRAG EVENTS
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5; // velocidad drag
    ref.current.scrollLeft = scrollLeft - walk;
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
      >
        {data.map((item, i) => (
          <div className="sorel-carousel-card" key={i}>
            <img src={item.img} alt={item.title} />
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
