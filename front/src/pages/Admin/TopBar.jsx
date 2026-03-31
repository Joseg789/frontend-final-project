import { Search, Bell, MessageSquare, Settings } from "lucide-react";

export const TopBar = () => {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search className="search-icon" />
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <div className="topbar-actions">
        <button className="icon-button">
          <Bell className="icon" />
          <span className="notification-dot" />
        </button>
        <button className="icon-button">
          <MessageSquare className="icon" />
        </button>
        <button className="icon-button">
          <Settings className="icon" />
        </button>
        <div className="avatar">JD</div>
      </div>
    </header>
  );
};
