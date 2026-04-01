import { motion } from "framer-motion"; // importamos motion para animar los paneles
import { useState } from "react";
import "./hero.css";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const [hovered, setHovered] = useState(null); //estado para saber que panel esta siendo hoverado
  const navigate = useNavigate();

  return (
    <div className="hero">
      {/* HOMBRE */}
      <motion.div
        className="panel-hero"
        onMouseEnter={() => setHovered("men")}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={(e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20; //calculamos la posición del mouse en relación al centro de la pantalla y la multiplicamos por 20 para dar un efecto de movimiento más pronunciado
          const y = (e.clientY / window.innerHeight - 0.5) * 20; //lo mismo para la posición vertical

          e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
        }}
        animate={{
          flex: hovered === "men" ? 2 : 1, //si el panel de hombre esta siendo hoverado, se expande a 2, sino se mantiene en 1
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }} //transición suave al expandirse o contraerse
      >
        <motion.div
          className="bg-hero"
          animate={{
            scale: hovered === "men" ? 1.1 : 1, //si el panel de hombre esta siendo hoverado, se escala a 1.1 para dar un efecto de zoom, sino se mantiene en 1
          }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          className="content-hero"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: hovered === "men" ? 1 : 0.6, //si el panel de hombre esta siendo hoverado, se muestra con opacidad 1, sino se muestra con opacidad 0.6 para dar un efecto de desvanecimiento
            y: hovered === "men" ? 0 : 20,
          }}
        >
          <h2>Hombre</h2>
          <p>Nueva colección 2026</p>
          <button onClick={() => navigate("/hombre")}>Explorar</button>
        </motion.div>
      </motion.div>

      {/* MUJER */}
      <motion.div
        className="panel-hero"
        onMouseEnter={() => setHovered("women")}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={(e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;

          e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
        }}
        animate={{
          flex: hovered === "women" ? 2 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-hero women"
          animate={{
            scale: hovered === "women" ? 1.1 : 1,
          }}
        />

        <motion.div
          className="content-hero"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: hovered === "women" ? 1 : 0.6,
            y: hovered === "women" ? 0 : 20,
          }}
        >
          <h2>Mujer</h2>
          <p>Estilo que define tendencia</p>
          <button onClick={() => navigate("/mujer")}>Explorar</button>
        </motion.div>
      </motion.div>
    </div>
  );
}
