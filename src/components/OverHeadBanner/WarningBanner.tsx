import { OctagonAlert, WifiOffIcon } from 'lucide-react';
import React, { useState } from 'react';

interface WarningBannerProps {
    type: 'no-internet' | 'error' | 'maintenance' | 'websocket-error' | null;
}

export default function WarningBanner({ type }: WarningBannerProps) {
    const [messages, setMessages] = useState<string[]>([]);

    React.useEffect(() => {
        if (type) {
            let message = '';
            let icon = null;

            switch (type) {
                case 'no-internet':
                    message = 'No internet connection. Please check your network.';
                    icon = <WifiOffIcon className='w-4 h-4 mr-2' />;
                    break;
                case 'error':
                    message = 'An error occurred. Please try again later.';
                    icon = <OctagonAlert className='w-4 h-4 mr-2' />;
                    break;
                case 'maintenance':
                    message = 'The system is under maintenance. Please check back soon.';
                    icon = <OctagonAlert className='w-4 h-4 mr-2' />;
                    break;
                case 'websocket-error':
                    message = 'Lost connection to real-time updates. Attempting to reconnect...';
                    icon = <OctagonAlert className='w-4 h-4 mr-2' />;
                    break;
                default:
                    message = '';
            }

            if (message && !messages.includes(message)) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }

            // if websocket-error attempt to reconnect
            if (type === 'websocket-error') {
                setTimeout(() => {
                    // Attempt to reconnect logic here
                }, 5000);
            }
        }
    }, [type, messages]);

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className='w-[98%] z-50 h-10 rounded-lg border my-1 flex items-center justify-center text-black font-semibold'
                    style={{
                        backgroundColor:
                            msg === 'An error occurred. Please try again later.'
                                ? '#ff4d4d'
                                : msg === 'The system is under maintenance. Please check back soon.'
                                ? '#f1c40f'
                                : msg === 'No internet connection. Please check your network.'
                                ? '#f1c40f'
                                : msg === 'Lost connection to real-time updates. Attempting to reconnect...'
                                ? '#e67e22'
                                : '#2ecc71',
                    }}
                >
                    {msg === 'No internet connection. Please check your network.' && (
                        <WifiOffIcon className='w-4 h-4 mr-2' />
                    )}
                    {msg === 'An error occurred. Please try again later.' && (
                        <OctagonAlert className='w-4 h-4 mr-2' />
                    )}
                    {msg === 'The system is under maintenance. Please check back soon.' && (
                        <OctagonAlert className='w-4 h-4 mr-2' />
                    )}
                    {msg === 'Lost connection to real-time updates. Attempting to reconnect...' && (
                        <OctagonAlert className='w-4 h-4 mr-2' />
                    )}
                    {msg}
                </div>
            ))}
        </div>
    );
}