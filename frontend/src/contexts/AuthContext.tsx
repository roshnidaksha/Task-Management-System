import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
  user: "",
  pass: "",
  isLogin: false,
  logout: () => { },
  updateUsername: (newUsername: string) => { },
  updatePassword: (newPassword: string) => { },
  toggleStatus: (val: boolean) => { }
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem("authUser") || "");
  const [pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(() => localStorage.getItem("isLogin") === "true");

  const logout = () => {
    setUser("");
    setPass("");
    setIsLogin(false);
    localStorage.removeItem("authUser");
    localStorage.removeItem("isLogin");
  };

  const toggleStatus = (val) => {
    setIsLogin(val);
    localStorage.setItem("isLogin", val.toString());
  }

  const updateUsername = (newUsername) => {
    setUser(newUsername);
    localStorage.setItem("authUser", newUsername);
  };

  const updatePassword = (newPassword) => {
    setPass(newPassword);
  };

  useEffect(() => {
    if (isLogin) {
      localStorage.setItem("authUser", user);
      localStorage.setItem("isLogin", "true");
    }
  }, [isLogin, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        pass,
        isLogin,
        logout,
        updateUsername,
        updatePassword,
        toggleStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};

export { AuthContext, AuthProvider };

export const useAuth = () => {
  return useContext(AuthContext);
};