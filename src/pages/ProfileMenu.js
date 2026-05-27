import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProfileMenu.css';

export default function ProfileMenu() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="profile-menu">
      <div className="profile-info">
        <div className="profile-avatar">
          <span className="avatar-circle">{user.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-details">
          <p className="profile-name">{user.name}</p>
          <button className="profile-button" onClick={() => window.location.href = '/profile'}>
            Profile
          </button>
        </div>
      </div>
      <button className="logout-button" onClick={logout}>×</button>
    </div>
  );
}
