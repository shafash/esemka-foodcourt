function AreaChart({ data = [], height = 180 }) {
  if (!data.length) return null;

  const width = 600;
  const paddingX = 16;
  const paddingY = 16;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const stepX = (width - paddingX * 2) / (data.length - 1 || 1);

  const points = data.map((d, index) => {
    const x = paddingX + index * stepX;
    const y = height - paddingY - (d.value / maxValue) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} ${height - paddingY} L ${firstPoint.x.toFixed(1)} ${height - paddingY} Z`;

  return (
    <div className="area-chart">
      <svg
        className="area-chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Grafik tren"
      >
        <path d={areaPath} className="area-chart__fill" />
        <path d={linePath} className="area-chart__line" />
        {points.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r={3} className="area-chart__dot" />
        ))}
      </svg>
      <div className="area-chart__labels">
        {data.map((d) => (
          <span key={d.label} className="area-chart__label">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default AreaChart;