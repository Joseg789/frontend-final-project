const metrics = [
  { name: "Page Views", value: 24567, max: 30000 },
  { name: "Sessions", value: 18234, max: 30000 },
  { name: "Users", value: 12847, max: 30000 },
  { name: "Bounce Rate", value: 23, max: 100 },
];

export const PerformanceMetrics = () => {
  return (
    <div className="performance-card">
      <h3 className="performance-title">Rendimiento</h3>
      <div className="metrics-list">
        {metrics.map((m) => (
          <div key={m.name} className="metric-row">
            <span className="metric-name">{m.name}</span>
            <div className="metric-bar-wrapper">
              <div className="metric-bar-bg">
                <div
                  className="metric-bar"
                  style={{ width: `${(m.value / m.max) * 100}%` }}
                />
              </div>
            </div>
            <span className="metric-value">{m.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
