"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const StatusContext = createContext({
    status: 'Online',
    setStatus: (status: string) => {},
});

export const useStatus = () => {
    return useContext(StatusContext);
};

interface StatusProviderProps {
    children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
    const [status, setStatus] = useState<string>('Online');

    useEffect(() => {
        const storedStatus = localStorage.getItem('status');
        if (storedStatus) {
            setStatus(storedStatus);
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'status') {
                setStatus(e.newValue || 'Online');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateStatus = (newStatus: string) => {
        localStorage.setItem('status', newStatus);
        setStatus(newStatus);
    };

    return (
        <StatusContext.Provider value={{ status, setStatus: updateStatus }}>
            {children}
        </StatusContext.Provider>
    );
};