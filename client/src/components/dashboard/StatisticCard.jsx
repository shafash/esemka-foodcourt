import Card from "../common/Card";

function StatisticCard({ label, value, caption, icon }) {
  return (
    <Card>
      <div className="statistic-card__header">
        <span className="statistic-card__label">{label}</span>
        {icon && <span className="statistic-card__icon">{icon}</span>}
      </div>
      <p className="statistic-card__value">{value}</p>
      {caption && <p className="statistic-card__caption">{caption}</p>}
    </Card>
  );
}

export default StatisticCard;