import React from 'react';

interface WarningBannerProps {
    type: 'no-internet' | 'error' | 'maintenance';
}

export default function WarningBanner({ type }: WarningBannerProps) {
    let message = '';

    switch (type) {
        case 'no-internet':
            message = 'No internet connection. Please check your network.';
            break;
        case 'error':
            message = 'An error occurred. Please try again later.';
            break;
        case 'maintenance':
            message = 'The system is under maintenance. Please check back soon.';
            break;
        default:
            message = '';
    }

    return (
        type && (
            <div className='w-full flex items-center justify-center'>
                <div className='w-[98%] z-50 h-10 rounded-lg border my-1 flex items-center justify-center text-black font-semibold' style={{ backgroundColor: type === 'error' ? '#ff4d4d' : type === 'maintenance' ? '#f1c40f' : type === 'no-internet' ? '#f1c40f' : '#4caf50' }}>
                    {message}
                </div>
            </div>
        )
    );
}