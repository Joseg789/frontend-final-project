import "./adminStyles.css";

export default function Chart({ title, data }) {
  const max = Math.max(...data.map((d) => d.value)); // Para normalizar las barras

  return (
    <div className="card-admin">
      <h3>{title}</h3>
      {data.map((item, i) => (
        <div key={i} className="chart-row">
          <div className="label-admin">{item.label}</div>
          <div className="bar-bg">
            <div
              className="bar"
              style={{ width: `${(item.value / max) * 100}%` }} // Normaliza el ancho de la barra
            />
          </div>
          <div className="value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
