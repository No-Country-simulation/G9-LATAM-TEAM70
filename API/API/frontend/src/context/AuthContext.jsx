import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar usuario del localStorage al montar la app
  useEffect(() => {
    const storedUser = localStorage.getItem('techmind_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error al parsear el usuario almacenado', e);
      }
    }
  }, []);

  const login = (userData) => {
    const userToSave = {
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      avatarUrl: userData.avatarUrl || '',
    };
    localStorage.setItem('techmind_user', JSON.stringify(userToSave));
    setUser(userToSave);
  };

  const logout = () => {
    localStorage.removeItem('techmind_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);