import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './Auth.css'; // ✅ we’ll restyle this file
import aclcLogo from '../assets/aclc-logo.png';


export default function Login({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
      if (onClose) onClose();
    }
  }, [user, navigate, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      login(res.data);

      setError('');
      if (onClose) onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side like Facebook */}
      <div className="login-left">
        <img src={aclcLogo} alt="ACLC Logo" className="login-logo" />
        <h1 className="login-tagline">
          Explore the things you <span>love.</span>
        </h1>
      </div>

      {/* Right side form */}
      <div className="login-right">
        <div className="login-form">
          <h2>Log into ACLC System</h2>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="auth-input"
            />
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <a href="#" className="forgot-link">Forgot password?</a>

          <NavLink to="/register" className="auth-link">
            <button className="register-btn">Create new account</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
