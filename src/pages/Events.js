import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './ProfileMenu.css';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // ✅ centralized axios instance

export default function Events() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // ✅ Helper for flexible image URLs
  const resolveImage = (path) =>
    path?.startsWith('http') ? path : `${api.defaults.baseURL}${path}`;

  // ✅ Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/api/events', {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err.response?.data || err.message);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Admin/Superadmin: create event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !image) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const res = await api.post('/api/events', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      setEvents([res.data, ...events]);
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (err) {
      console.error('Failed to create event:', err.response?.data || err.message);
    }
  };

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
                      src={resolveImage(user?.avatar || '/uploads/default-avatar.png')}
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

        {/* ✅ Page content */}
        <section className="content-card">
          <h2>Events</h2>

          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <form onSubmit={handleCreateEvent} style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="auth-input"
              />
              <textarea
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="auth-input"
                rows="3"
              />
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
              <button type="submit" className="auth-button">POST</button>
            </form>
          )}

          <div className="events-grid">
            {events.map((ev) => (
              <div key={ev._id} className="event-card">
                <Link to={`/events/${ev._id}`} className="event-link">
                  <h4 className="event-title-list">{ev.title}</h4>
                  <img
                    src={resolveImage(ev.image)}
                    alt="Event"
                    className="event-image"
                  />
                </Link>

                <div className="event-reactions">
                  <span>👍 {ev.reactions.like}</span>
                  <span>❤️ {ev.reactions.love}</span>
                  <span>😮 {ev.reactions.wow}</span>
                </div>

                <p className="event-views">👁 {ev.views} views</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
