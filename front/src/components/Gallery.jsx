import { useState, useEffect } from "react";
import "./gallery.css";

import { images } from "../utils/data";

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [loaded, setLoaded] = useState({});

  // preload primeras imágenes
  useEffect(() => {
    images.slice(0, 4).forEach((img) => {
      const preload = new Image();
      preload.src = img.src;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // cerrar modal con Escape
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  return (
    <>
      <div className="gallery">
        {images.map((img, index) => (
          <div className="card" key={img.id} onClick={() => setSelected(img)}>
            <img
              src={img.src}
              alt={img.title}
              loading={index < 4 ? "eager" : "lazy"}
              onLoad={() => setLoaded((prev) => ({ ...prev, [img.id]: true }))}
              className={loaded[img.id] ? "img loaded" : "img"}
            />
            <div className="overlay">
              <h3>{img.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img
            src={selected.src}
            alt={selected.title}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
