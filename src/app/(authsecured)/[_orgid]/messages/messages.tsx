"use client"
import ActiveUsers from '@/components/activeUsers/activeUsers';
import AuthChecks from '../../authchecks';
import LockedSidebar from '@/components/sidebar/sidebar';
import { getAuth, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function Messages() {
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
            <main className="bg-[#101218] w-full min-h-screen  h-full overflow-hidden">
                <div className="flex flex-row justify-between overflow-hidden h-screen">
                    <LockedSidebar user={user as any} />
                    <div className='bg-[#101218] w-full h-full changedscrollbar overflow-y-scroll '>
                        <div className="flex flex-col items-start  justify-start w-full h-full">
                            <div className="h-12 flex items-center justify-end px-3 w-full">
                                <MoreHorizontal size={24} className="text-muted-foreground" />
                            </div>
                            <div className="container mx-auto xl:px-56 px-2 flex flex-col justify-start items-start w-full h-full">
                            </div>
                        </div>
                    </div>
                    <div className='h-full flex items-start justify-start top-0 z-50 bg-white/5'>
                    <ActiveUsers />
                    </div>
                </div>
            </main>
        </AuthChecks>
    )
}