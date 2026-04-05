type SidebarProps = {
  activeView: string;
  onChange: (view: string) => void;
};

const items = [
  { id: "dashboard", label: "Dashboard" },
  { id: "posts", label: "Posts" },
  { id: "pages", label: "Pages" },
  { id: "categories", label: "Categories" },
  { id: "settings", label: "Settings" }
];

export function Sidebar({ activeView, onChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">W</span>
        <div>
          <p>WPClone</p>
          <small>React + TypeScript CMS</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={activeView === item.id ? "nav-button active" : "nav-button"}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
