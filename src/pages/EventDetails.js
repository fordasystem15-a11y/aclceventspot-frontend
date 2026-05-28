import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './ProfileMenu.css';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ use centralized axios instance

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [commentText, setCommentText] = useState('');

  // ✅ Fetch single event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEvent(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchEvent();
  }, [id]);

  // ✅ React
  const handleReact = async (type) => {
    try {
      const res = await api.post(
        `/api/events/${id}/react`,
        { type },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setEvent(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Comment
  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(
        `/api/events/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setEvent(res.data);
      setCommentText('');
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Delete Event (Admins/Superadmins only)
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Event deleted successfully!');
        navigate('/events');
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar user={user} />
      <div className="main-content">
        <section className="event-details-layout">
          <h2>Event Details</h2>

          {/* ✅ Buttons row above the picture */}
          <div className="event-header-buttons">
            <button className="back-button" onClick={() => window.history.back()}>
              ← Go back
            </button>

            {(user.role === 'admin' || user.role === 'superadmin') && (
              <button className="delete-button" onClick={handleDelete}>
                Delete Event
              </button>
            )}
          </div>

          <div className="event-details-content">
            {/* Left side: Picture */}
            <div className="event-image-box">
              <img
                src={`${api.defaults.baseURL}${event.image}`}
                alt="Event"
                className="event-image"
              />
            </div>

            {/* Right side: Info */}
            <div className="event-info-box">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
              </div>

              <div className="event-reactions">
                <button
                  className={`like ${
                    event.reactedBy.some(
                      (r) => r.user === (user._id || user.id) && r.type === 'like'
                    )
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleReact('like')}
                >
                  👍 {event.reactions.like}
                </button>
                <button
                  className={`love ${
                    event.reactedBy.some(
                      (r) => r.user === (user._id || user.id) && r.type === 'love'
                    )
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleReact('love')}
                >
                  ❤️ {event.reactions.love}
                </button>
                <button
                  className={`wow ${
                    event.reactedBy.some(
                      (r) => r.user === (user._id || user.id) && r.type === 'wow'
                    )
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleReact('wow')}
                >
                  😮 {event.reactions.wow}
                </button>
              </div>

              <p className="event-views">👁 {event.views} views</p>

              {/* Comments */}
              <div className="event-comments">
                {event.comments.map((c, i) => (
                  <div key={i} className="comment-item">
                    <img
                      src={`${api.defaults.baseURL}${c.avatar || '/uploads/default-avatar.png'}`}
                      alt="avatar"
                      className="comment-avatar"
                    />
                    <p>
                      <strong>{c.user}:</strong> {c.text}
                    </p>
                  </div>
                ))}
                <div className="comment-input">
                  <img
                    src={`${api.defaults.baseURL}${user?.avatar || '/uploads/default-avatar.png'}`}
                    alt="avatar"
                    className="comment-avatar"
                  />
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleComment();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
