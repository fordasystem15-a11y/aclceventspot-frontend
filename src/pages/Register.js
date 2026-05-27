import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // 👈 import the CSS file

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [role] = useState('user'); // ✅ fixed role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!address.trim()) return "Address is required";
    if (!phone.trim()) return "Phone number is required";
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) return "Invalid phone number format";
    if (!birthdate) return "Birthdate is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        address,
        phone,
        birthdate,
        role, // always "user"
      });

      console.log("Register response:", res.data);

      setError('');
      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.error || "Registration failed");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side branding */}
      <div className="login-left">
        <img src="/aclc-logo.png" alt="ACLC Logo" className="login-logo" />
        <h1 className="login-tagline">
          Create your <span>ACLC account.</span>
        </h1>
      </div>

      {/* Right side form */}
      <div className="login-right">
        <div className="login-form">
          <h2>Register</h2>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} className="auth-input" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="auth-input" />
            <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="auth-input" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className="auth-input" />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} className="auth-input" />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} className="auth-input" />
            <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} disabled={loading} className="auth-input" />
            <button type="submit" disabled={loading} className="register-btn">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
