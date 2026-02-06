import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { AuthContextType } from "../types";
import { login as apiLogin } from "../api/auth";

const AuthContext = createContext<AuthContextType | null>(null);

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const inactivityTimerRef = useRef<number | null>(null);

    const logout = useCallback(() => {
        sessionStorage.removeItem("access_token");
        setIsAuthenticated(false);
        if (inactivityTimerRef.current) {
            window.clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
        }
    }, []);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            window.clearTimeout(inactivityTimerRef.current);
        }
        if (sessionStorage.getItem("access_token")) {
            inactivityTimerRef.current = window.setTimeout(() => {
                logout();
            }, INACTIVITY_TIMEOUT_MS);
        }
    }, [logout]);

    // Check for existing token on mount
    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        setIsAuthenticated(!!token);
        setIsLoading(false);
        if (token) {
            resetInactivityTimer();
        }
    }, [resetInactivityTimer]);

    // Track user activity to reset inactivity timer
    useEffect(() => {
        if (!isAuthenticated) return;

        const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];

        const handleActivity = () => {
            resetInactivityTimer();
        };

        activityEvents.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            activityEvents.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            if (inactivityTimerRef.current) {
                window.clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [isAuthenticated, resetInactivityTimer]);

    const login = async (email: string, password: string) => {
        const tokens = await apiLogin({ username: email, password });
        sessionStorage.setItem("access_token", tokens.access_token);
        setIsAuthenticated(true);
        resetInactivityTimer();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
