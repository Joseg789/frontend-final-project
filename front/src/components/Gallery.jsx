import { useState, useEffect } from "react";

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    title: "Urban Style",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0",
    title: "Winter Essentials",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    title: "Minimal Sneakers",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552",
    title: "Outdoor Ready",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1701280733078-b2167ff8be39?w=500&auto=format&fit=crop&q=60",
    title: "Modern Look",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    title: "Modern Look",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=735&auto=format&fit=crop",
    title: "Modern Look",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1618329918461-51bb072e0ea5?w=500&auto=format&fit=crop&q=60",
    title: "Modern Look",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1564605396089-1ac1668de82d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fG1vZGElMjBtb250YSVDMyVCMWF8ZW58MHx8MHx8fDA%3D",
    title: "Modern Look",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1648564101688-2f9b16c4098a?w=500&auto=format&fit=crop&q=60",
    title: "New Arrivals",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1727102440446-f8a40bbca32a?w=500&auto=format&fit=crop&q=60",
    title: "New Arrivals",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/flagged/photo-1553231286-512078734988?q=80&w=1170&auto=format&fit=crop",
    title: "New Arrivals",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1546274498-e9bde117a82c?w=500&auto=format&fit=crop&q=60",
    title: "New Arrivals",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1715709969630-e98207ea4c18?w=500&auto=format&fit=crop&q=60",
    title: "New Arrivals",
  },
  {
    id: 17,
    src: "https://images.unsplash.com/photo-1535346256685-0527f1dfd658?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fE1PREElMjBNT05UQSVDMyU5MUF8ZW58MHx8MHx8fDA%3D",
    title: "New Arrivals",
  },
  {
    id: 18,
    src: "https://images.unsplash.com/photo-1726441205310-69282da4d13c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "New Arrivals",
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [loaded, setLoaded] = useState({});

  // preload primeras imágenes
  useEffect(() => {
    images.slice(0, 4).forEach((img) => {
      const preload = new Image();
      preload.src = img.src;
    });
  }, []);

  return (
    <>
      <div className="gallery">
        {images.map((img, index) => (
          <div className="card" key={img.id}>
            <img
              src={img.src}
              alt={img.title}
              loading={index < 4 ? "eager" : "lazy"}
              onLoad={() => setLoaded((prev) => ({ ...prev, [img.id]: true }))}
              className={loaded[img.id] ? "img loaded" : "img"}
              onClick={() => setSelected(img)}
            />

            <div className="overlay">
              <h3>{img.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img src={selected.src} alt="" />
        </div>
      )}
    </>
  );
}
