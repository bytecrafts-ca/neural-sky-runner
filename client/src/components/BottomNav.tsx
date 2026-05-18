import { NavLink } from "react-router-dom";

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <NavLink to="/" className={({ isActive }) => `nav-tab${isActive ? " nav-tab--active" : ""}`} end>
        <span className="nav-tab__icon">▶</span>
        Home
      </NavLink>
      <NavLink to="/shorts" className={({ isActive }) => `nav-tab${isActive ? " nav-tab--active" : ""}`}>
        <span className="nav-tab__icon">⚡</span>
        Shorts
      </NavLink>
    </nav>
  );
}
