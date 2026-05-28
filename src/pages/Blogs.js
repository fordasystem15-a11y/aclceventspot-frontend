import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './ProfileMenu.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api'; // ✅ centralized axios instance

export default function Blogs() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Helper for flexible image URLs
  const resolveImage = (path) =>
    path?.startsWith('http') ? path : `${api.defaults.baseURL}${path}`;

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/blogs', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Fetch events for dropdown
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

  // ✅ Handle blog post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !content.trim()) {
      toast.error('Please select an event and write something.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(
        '/api/blogs',
        { event: selectedEvent, content },
        { headers: { Authorization: localStorage.getItem('token') } }
      );

      const eventObj = events.find((ev) => ev._id === selectedEvent);
      const newBlog = {
        ...res.data,
        event: { title: eventObj?.title || 'Unknown Event' },
        author: { name: user.name, avatar: user.avatar },
        reactions: { like: [], love: [], wow: [] },
      };

      setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
      toast.success('Blog posted successfully! 🎉');
      fetchBlogs();
      setSelectedEvent('');
      setContent('');
    } catch (err) {
      console.error('Failed to post blog:', err.response?.data || err.message);
      toast.error('Failed to post blog.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle reactions
  const handleReaction = async (blogId, type) => {
    try {
      const res = await api.post(
        `/api/blogs/${blogId}/react`,
        { type },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b._id === blogId ? res.data : b))
      );
    } catch (err) {
      console.error('Failed to react:', err.response?.data || err.message);
      toast.error('Failed to react.');
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
          <h2>Blogs</h2>
          <p>Here you can read and publish blog posts.</p>

          {user && (
            <form className="blog-form" onSubmit={handleSubmit}>
              <label>Related Event:</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select Event --</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title}
                  </option>
                ))}
              </select>

              <label>Your Insight:</label>
              <textarea
                placeholder="Share your thoughts (even 1 word is fine)..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Publishing...' : 'Publish Blog'}
              </button>
            </form>
          )}

          <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
            {blogs.map((blog) => (
              <li key={blog._id} className="blog-card">
                <h3>{blog.event?.title}</h3>
                <p className="blog-author">By {blog.author?.name || 'Anonymous'}</p>
                <p className="blog-content">{blog.content}</p>
                <p className="blog-timestamp">
                  Posted on {new Date(blog.createdAt).toLocaleString()}
                </p>

                <div className="reactions-container">
                  <button
                    className={`reaction-btn like ${blog.reactions?.like?.includes(user._id) ? 'active' : ''}`}
                    onClick={() => handleReaction(blog._id, 'like')}
                  >
                    👍 {blog.reactions?.like?.length || 0}
                  </button>
                  <button
                    className={`reaction-btn love ${blog.reactions?.love?.includes(user._id) ? 'active' : ''}`}
                    onClick={() => handleReaction(blog._id, 'love')}
                  >
                    ❤️ {blog.reactions?.love?.length || 0}
                  </button>
                  <button
                    className={`reaction-btn wow ${blog.reactions?.wow?.includes(user._id) ? 'active' : ''}`}
                    onClick={() => handleReaction(blog._id, 'wow')}
                  >
                    😮 {blog.reactions?.wow?.length || 0}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
