import { UserPlus, ShoppingCart, FileText, AlertCircle } from "lucide-react";
import "./adminStyles.css";

const activities = [
  {
    icon: UserPlus,
    iconBgClass: "icon-info",
    title: "New user registered",
    description: "Sarah Johnson joined the platform",
    time: "2 minutes ago",
  },
  {
    icon: ShoppingCart,
    iconBgClass: "icon-success",
    title: "New order received",
    description: "Order #12847 worth $299.99",
    time: "5 minutes ago",
  },
  {
    icon: FileText,
    iconBgClass: "icon-warning",
    title: "Report generated",
    description: "Monthly sales report is ready",
    time: "15 minutes ago",
  },
  {
    icon: AlertCircle,
    iconBgClass: "icon-destructive",
    title: "System notification",
    description: "Server maintenance scheduled",
    time: "1 hour ago",
  },
  {
    icon: ShoppingCart,
    iconBgClass: "icon-success",
    title: "New order received",
    description: "Order #128479 worth $399.99",
    time: "15 minutes ago",
  },
  {
    icon: FileText,
    iconBgClass: "icon-warning",
    title: "Report generated",
    description: "Monthly sales report is ready",
    time: "15 minutes ago",
  },
  {
    icon: AlertCircle,
    iconBgClass: "icon-destructive",
    title: "System notification",
    description: "Server maintenance scheduled",
    time: "1 hour ago",
  },
  {
    icon: ShoppingCart,
    iconBgClass: "icon-success",
    title: "New order received",
    description: "Order #128479 worth $399.99",
    time: "15 minutes ago",
  },
];

export const RecentActivity = () => {
  return (
    <div className="recent-activity-card">
      <h3 className="recent-activity-title">Recent Activity</h3>
      <div className="activities-list">
        {activities.map((a, i) => (
          <div key={i} className="activity-row">
            <div className={`activity-icon ${a.iconBgClass}`}>
              <a.icon className="icon-svg" />
            </div>
            <div className="activity-content">
              <p className="activity-title">{a.title}</p>
              <p className="activity-description">{a.description}</p>
              <p className="activity-time">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="view-all-btn">View all activities</button>
    </div>
  );
};
