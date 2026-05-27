import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ import toast
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        toast.error(err.response?.data?.error || 'Failed to fetch users'); // ✅ error toast
      }
    };
    fetchUsers();
  }, []);

  const promoteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/admin/promote/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message); // ✅ success toast
      setUsers(users.map(u => u._id === id ? res.data.user : u));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to promote user'); // ✅ error toast
    }
  };

  const demoteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/admin/demote/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message); // ✅ success toast
      setUsers(users.map(u => u._id === id ? res.data.user : u));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to demote user'); // ✅ error toast
    }
  };

  return (
    <div className="users-page">
      <h2>All Users</h2>
      {error && <p className="error">{error}</p>}

      <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.role === 'user' && (
                    <button
                      className="promote-btn"
                      onClick={() => promoteUser(user._id)}
                    >
                      Promote
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      className="demote-btn"
                      onClick={() => setConfirmAction(user)}
                    >
                      Demote
                    </button>
                  )}
                  {user.role === 'superadmin' && (
                    <button className="superadmin-btn" disabled>
                      🔒 Super Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Demotion</h3>
            <p>
              Are you sure you want to demote <strong>{confirmAction.name}</strong>{' '}
              back to a user?
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  demoteUser(confirmAction._id);
                  setConfirmAction(null);
                }}
              >
                Yes, Demote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
