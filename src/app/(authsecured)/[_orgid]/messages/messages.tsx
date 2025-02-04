"use client"
import ActiveUsers from '@/components/activeUsers/activeUsers';
import AuthChecks from '../../authchecks';
import LockedSidebar from '@/components/sidebar/sidebar';
import { getAuth, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function Messages() {
    const [message, setMessage] = useState("")
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth();
        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                setUser(user);
            });
    
            return () => unsubscribe();
        }, [auth]);

    return(
        <AuthChecks>
            <main className="bg-[#101218] w-full min-h-screen overflow-hidden">
            <div className="flex h-screen">
                <LockedSidebar user={user as any}  />
                <aside className="w-80 bg-black/10 border-l border-white/10 overflow-y-auto flex flex-col">
                    <div className='flex flex-col px-1.5 gap-2 py-2'>
                        {
                            [1,2,3,4,5,6,7,8,9,10].map((i) => (
                                <div key={i} className="flex items-center space-x-2 bg-white/20 hover:bg-white/10 rounded-md px-2 py-1">
                                    <div className="flex flex-col">
                                        <div className="w-[100%] h-4 bg-white/20 rounded-md"></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </aside>
                <div className="flex-grow overflow-hidden flex flex-col">
                <header className="h-16 flex items-center justify-between border-b border-white/10 px-4">
                    <h1 className="text-white text-xl font-bold">#help</h1>
                    <button
                    aria-label="More options"
                    className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                    >
                    <MoreHorizontal size={24} />
                    </button>
                </header>
                <div className="flex-grow overflow-y-auto px-4 py-2">
                    b
                </div>
                <div className="h-16 border-t border-white/10 px-4 flex items-center">
                    <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="w-full bg-white/5 text-white placeholder-white/50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Type a message"
                    />
                </div>
                </div>
                <div className="bg-white/5 border-l border-white/10">
                <ActiveUsers />
                </div>
            </div>
            </main>
        </AuthChecks>
    )
}