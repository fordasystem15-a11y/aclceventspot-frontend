import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ user }) {
  return (
    <aside className="sidebar">
      {/* Top section: logo + menu */}
      <div className="sidebar-top">
        <div className="sidebar-header">
          <img src="/aclc-logo.png" alt="ACLC Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">EventSpot</h2>
        </div>

        <nav>
          <ul className="sidebar-menu">
            <li>
              <NavLink to="/dashboard" className="sidebar-link">
                <span className="icon"></span> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className="sidebar-link">
                <span className="icon"></span> Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/blogs" className="sidebar-link">
                <span className="icon"></span> Blogs
              </NavLink>
            </li>

            {/* ✅ Show Users link only for admins */}
            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <li>
                <NavLink to="/users" className="sidebar-link">
                  <span className="icon"></span> Users
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
