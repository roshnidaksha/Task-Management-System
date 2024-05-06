import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
    user: "",
    pass: "",
    isLogin: false,
    logout: () => {},
    updateUsername: (newUsername: string) => {},
    updatePassword: (newPassword: string) => {},
    toggleStatus: (val: boolean) => {}
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [isLogin, setIsLogin] = useState(false); 

    const logout = () => {
        setUser("");
        setPass("");
        setIsLogin(false);
    };

    const toggleStatus = (val) => {
        setIsLogin(val);
    }

    const updateUsername = (newUsername) => {
        setUser(newUsername);
    };

    const updatePassword = (newPassword) => {
        setPass(newPassword);
    };

    return (
        <AuthContext.Provider value={{ user, pass, isLogin, logout, updateUsername, updatePassword, toggleStatus }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider };

export const useAuth = () => {
    return useContext(AuthContext);
};