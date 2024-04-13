import { createContext, useEffect, useState } from "react";
import { registerRequest, loginRequest } from "../api/auth";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true)

  const signUp = async (user) => {
    try {
      const newUser = {
        name: user.name,
        email: user.email,
        password: user.password,
      };
      const res = await registerRequest(newUser);
      setUser(res.data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setUser(null);
    }
  };

  const signIn = async (user) => {
    try {
      const userToLogin = {
        email: user.email,
        password: user.password,
      };
      const res = await loginRequest(userToLogin);
      setUser(res.user);
      setError(null);
      setIsAuthenticated(true);
      Cookies.set('token', res.token, { expires: 1 });
    } catch (error) {
      setError(error.message);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if(token){
        setIsAuthenticated(true);
    }
    setLoading(false)
  }, []);

  const signOut = () => {
    setUser(null);
    Cookies.remove('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        user,
        error,
        isAuthenticated,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
