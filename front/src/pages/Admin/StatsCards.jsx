import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "24,567",
    change: "+12.5% from last month",
    positive: true,
    icon: Users,
    iconClass: "icon-info",
  },
  {
    title: "Revenue",
    value: "$84,230",
    change: "+8.2% from last month",
    positive: true,
    icon: DollarSign,
    iconClass: "icon-success",
  },
  {
    title: "Orders",
    value: "1,429",
    change: "-2.4% from last month",
    positive: false,
    icon: ShoppingCart,
    iconClass: "icon-warning",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+0.3% from last month",
    positive: true,
    icon: TrendingUp,
    iconClass: "icon-success",
  },
];

export const StatsCards = () => {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.title} className="stat-card">
          <div className="stat-header">
            <div>
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className={`stat-icon-wrapper ${stat.iconClass}`}>
              <stat.icon className="stat-icon" />
            </div>
          </div>
          <p
            className={`stat-change ${stat.positive ? "positive" : "negative"}`}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};
