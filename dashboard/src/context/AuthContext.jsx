import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {

        const restoreSession = async () => {

            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get("/auth/me");
                setUser(response.data.data);
            } catch (error) {
                localStorage.removeItem("accessToken");
            } finally {
                setIsLoading(false);
            }

        };

        restoreSession();

    }, []);





    const login = async (email, password) => {

        const response = await api.post("/auth/login", { email, password });

        localStorage.setItem("accessToken", response.data.data.accessToken);
        setUser(response.data.data.user);

    };



    const register = async (name, email, password) => {

        const response = await api.post("/auth/register", { name, email, password });

        localStorage.setItem("accessToken", response.data.data.accessToken);
        setUser(response.data.data.user);

    };




    const logout = () => {

        localStorage.removeItem("accessToken");
        setUser(null);

    };



    const deleteAccount = async () => {

        await api.delete("/auth/account");
        logout();

    };






    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );

};






export const useAuth = () => useContext(AuthContext);
