import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Blogs from './pages/Blogs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import EventDetails from './pages/EventDetails';

// ✅ Toastify imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        {/* Default route now shows Login first */}
        <Route path="/" element={<Login />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main app routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
      </Routes>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
