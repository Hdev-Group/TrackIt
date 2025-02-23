"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from "../../app/firebase/AuthContext";

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
    const { user } = useAuth();
    const [status, setStatus] = useState<string>('Online');

    useEffect(() => {
        const fetchStatus = async () => {
            let userToken: string | undefined;
            if (user) {
                userToken = await user.getIdToken(); 
                console.log(userToken, "token");
            } else {
                return;
            }
            try {
                const response = await fetch('/api/application/v1/users/restricted/status/getStatus', {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                    method: "POST",
                    body: JSON.stringify({ userId: user?.uid }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch status');
                }
                const data = await response.json();
                setStatus(data.status || 'Online');
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        };
    
        fetchStatus();

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

    const updateStatus = async (newStatus: string) => {
        localStorage.setItem('status', newStatus);

        const userToken = await user?.getIdToken();

        try {
            const response = await fetch('/api/application/v1/users/restricted/status/changeStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
        console.log(newStatus, "newStatus");
        setStatus(newStatus);
    };

    return (
        <StatusContext.Provider value={{ status, setStatus: updateStatus }}>
            {children}
        </StatusContext.Provider>
    );
};