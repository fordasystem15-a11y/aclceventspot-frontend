import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import api from '../api'; // ✅ use centralized axios instance

export default function Profile() {
  const { user, updateAvatar } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(null);

  // Helper function to format birthdate
  const formatBirthdate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return "Not available";
    }
  };

  // ✅ Upload avatar
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const res = await api.post('/api/users/avatar', formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
          'Content-Type': 'multipart/form-data' 
        }
      });
      alert('Avatar updated!');
      updateAvatar(res.data.avatar);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="main-content">
        <section className="content-card">
          <h2>Profile</h2>

          {/* Avatar */}
          <div className="profile-avatar-section">
            <img 
              src={`${api.defaults.baseURL}${user?.avatar || '/uploads/default-avatar.png'}`} 
              alt="avatar" 
              className="profile-avatar-large" 
            />
            <form onSubmit={handleAvatarUpload}>
              <input 
                type="file" 
                onChange={(e) => setAvatar(e.target.files[0])} 
              />
              <button type="submit" className="auth-button">Upload Avatar</button>
            </form>
          </div>

          {/* Details */}
          <div className="profile-details">
            <p><strong>Name:</strong> {user?.name || "Not available"}</p>
            <p><strong>Email:</strong> {user?.email || "Not available"}</p>
            <p><strong>Role:</strong> {user?.role || "Not available"}</p>
            <p><strong>Address:</strong> {user?.address || "Not available"}</p>
            <p><strong>Phone:</strong> {user?.phone || "Not available"}</p>
            <p><strong>Birthdate:</strong> {formatBirthdate(user?.birthdate)}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
