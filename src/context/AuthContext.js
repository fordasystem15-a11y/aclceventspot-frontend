import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse saved user:", err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ✅ Ensure role and avatar are always stored
  const login = (data) => {
    if (data.user) {
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        address: data.user.address,
        phone: data.user.phone,
        birthdate: data.user.birthdate,
        avatar: data.user.avatar || '/uploads/default-avatar.png', // ✅ include avatar
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
    }
  };

  // ✅ Update avatar globally after upload
  const updateAvatar = (newAvatarPath) => {
    const updatedUser = { ...user, avatar: newAvatarPath };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
