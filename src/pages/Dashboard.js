import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './ProfileMenu.css'; // ✅ new CSS for profile box

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar user={user} />

      <div className="main-content">
        {/* ✅ Header area */}
        <div className="dashboard-header">
          <div className="header-right">
            {user && (
              <div className="profile-menu">
                <div className="profile-info">
                  <div className="profile-avatar">
                    <img
                      src={`http://localhost:5000${user?.avatar || '/uploads/default-avatar.png'}`}
                      alt="avatar"
                      className="profile-avatar-img"
                    />
                  </div>
                  <div className="profile-details">
                    <p className="profile-name">{user.name || 'User'}</p>
                    <button
                      className="profile-button"
                      onClick={() => navigate('/profile')}
                    >
                      Profile
                    </button>
                  </div>
                </div>
                <button className="logout-button" onClick={logout}>
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Dashboard content */}
        <section className="dashboard-grid">
          <div className="content-card">
            <h3>Events</h3>
            <p>View and manage upcoming events.</p>
            <button className="auth-button" onClick={() => navigate('/events')}>
              Go to Events
            </button>
          </div>

          <div className="content-card">
            <h3>Blogs</h3>
            <p>Read and publish blog posts.</p>
            <button className="auth-button" onClick={() => navigate('/blogs')}>
              Go to Blogs
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
