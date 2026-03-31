const sources = [
  { name: "Desktop", value: 65 },
  { name: "Mobile", value: 28 },
  { name: "Tablet", value: 7 },
];

export const TrafficSources = () => {
  return (
    <div className="traffic-card">
      <h3 className="traffic-title">Trafico</h3>
      <div className="traffic-list">
        {sources.map((s) => (
          <div key={s.name} className="traffic-row">
            <span className="traffic-name">{s.name}</span>
            <div className="traffic-bar-wrapper">
              <div className="traffic-bar-bg">
                <div className="traffic-bar" style={{ width: `${s.value}%` }} />
              </div>
            </div>
            <span className="traffic-value">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
