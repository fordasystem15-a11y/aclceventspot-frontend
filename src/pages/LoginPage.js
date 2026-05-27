import './LoginPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, password });
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      {/* Left side */}
      <div className="login-left">
        <img src="/aclc-logo.png" alt="ACLC Logo" className="login-logo" />
        <h1 className="login-tagline">
          Explore the things you <span>love.</span>
        </h1>
      </div>

      {/* Right side */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Log into ACLC System</h2>
          <input
            type="email"
            placeholder="Email or student ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Log In</button>
          <a href="#" className="forgot-link">Forgot password?</a>
          <button
            type="button"
            className="register-btn"
            onClick={() => navigate('/register')}
          >
            Create new account
          </button>
        </form>
      </div>
    </div>
  );
}
