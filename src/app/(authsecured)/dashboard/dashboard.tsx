"use client";

import LockedSidebar from '@/components/sidebar/sidebar';
import AuthChecks from '../authchecks';
import { AlertCircle, CheckCircle, Clock, MoreHorizontal, Ticket } from 'lucide-react';
import { getAuth, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    function getGreetingTime() {
        const time = new Date();
        const currentHour = time.getHours();
        if (currentHour >= 5 && currentHour < 12) {
            return 'Morning';
        } else if (currentHour >= 12 && currentHour < 17) {
            return 'Afternoon';
        } else {
            return 'Evening';
        }
    }

    return (
        <AuthChecks>
            <main className="bg-[#101218] w-full min-h-screen h-full overflow-hidden">
                <div className="flex flex-row justify-between items-baseline h-screen">
                    <LockedSidebar user={user} />
                    <div className='bg-[#101218] w-full h-full overflow-y-scroll '>
                        <div className="flex flex-col items-start justify-start w-full h-full">
                            <div className="h-12 flex items-center justify-end px-3 w-full">
                                <MoreHorizontal size={24} className="text-muted-foreground" />
                            </div>
                            <div className="container mx-auto xl:px-56 px-2 flex flex-col justify-start items-start w-full h-full">
                                {/* Greeting */}
                                <div className="flex flex-row items-center justify-center w-full mb-6">
                                    <h1 className="text-[34px] text-foreground font-semibold">
                                        Good {getGreetingTime()},
                                    </h1>
                                    <div className="px-2 py-[1px] transition-all ml-1 rounded-md  text-foreground text-[34px] font-semibold">
                                        {user?.displayName?.split(' ')[0]}.
                                    </div>
                                </div>
                                <div className='flex flex-col w-full gap-4 mb-28'>
                                    <AssignedTickets/>
                                    <TicketStats/>
                                    <RecentActivities/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthChecks>
    );
}

function AssignedTickets(){
    return(
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative">
                        </div> 
                        <h2 className='text-muted-foreground font-medium text-[13px] ml-2'>Assigned Tickets</h2>  
                    </div>
                    <div className='group-hover:opacity-100 opacity-0 transition-all items-center'>
                        <MoreHorizontal size={22} className='text-muted-foreground cursor-pointer' />
                    </div>
                </div>                        
            </div>
            <div className='flex flex-row bg-muted-foreground/10 justify-between items-center w-full rounded-lg'>
                <div className='border-r flex items-center justify-center flex-col border-muted-foreground/20 py-10 h-full w-full'>
                    <div className='flex items-start justify-start flex-col gap-2 px-10'>
                        <p className='text-muted-foreground text-[14px] font-medium mt-0.5'>There are no tickets assigned to you, Yet..</p>
                    </div>
                </div>
                <div className='w-full p-5 flex h-full items-start justify-start flex-col gap-2'>
                    <div className='flex items-start justify-start w-full flex-row gap-2'>
                        <div className='flex flex-col justify-between w-1/2'>
                            <h2 className='text-muted-foreground/60 font-medium text-[13px]'>My Tickets</h2>
                            <p className='text-muted-foreground/50 text-[13px]'>Hmm, All empty here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TicketStats() {
    // Dummy data for demonstration purposes
    const stats = {
        totalTickets: 10,
        averageResponseTime: "2 hours",
        resolvedTickets: 7,
        pendingTickets: 3,
      }
    

    return (
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative">
                        </div>
                        <h2 className='text-muted-foreground font-medium text-[13px] ml-2'>Ticket Stats</h2>
                    </div>
                    <div className='group-hover:opacity-100 opacity-0 transition-all items-center'>
                        <MoreHorizontal size={22} className='text-muted-foreground cursor-pointer' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-muted-foreground/10 py-10 justify-between items-center w-full rounded-lg'>
            <div className="flex gap-4 flex-wrap w-full  px-10">
                <div className='w-full flex flex-col gap-5 md:flex-row justify-between'>
                    <div className="flex flex-col space-y-2 ">
                        <p className="text-xs font-medium text-muted-foreground">Total Tickets</p>
                        <div className="flex items-center">
                        <Ticket className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{stats.totalTickets}</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 w-full md:w-1/2">
                        <p className="text-xs font-medium text-muted-foreground">Avg Response Time</p>
                        <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{stats.averageResponseTime}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-5 md:flex-row justify-between'>
                    <div className="flex flex-col space-y-2 w-full md:w-1/2">
                        <p className="text-xs font-medium text-muted-foreground">Resolved Tickets</p>
                        <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-2xl font-bold">{stats.resolvedTickets}</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 w-full md:w-1/2">
                        <p className="text-xs font-medium text-muted-foreground">Pending Tickets</p>
                        <div className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        <span className="text-2xl font-bold">{stats.pendingTickets}</span>
                        </div>
                    </div>
                </div>
                </div>

            </div>
        </div>
    );
}


function RecentActivities() {
    interface ActivityItem {
        id: number
        user: string
        action: string
        color: string
        emoji: JSX.Element
        target: string
        timestamp: string
      }

    function timeAgo(timestamp: string) {
        const date = new Date(parseInt(timestamp) * 1000);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = Math.floor(seconds / 31536000);
      
        if (interval > 1) {
          return interval + " years ago";
        } else if (interval === 1) {
          return "1 year ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        } else if (interval === 1) {
          return "1 month ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        } else if (interval === 1) {
          return "1 day ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        } else if (interval === 1) {
          return "1 hour ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        } else if (interval === 1) {
          return "1 minute ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }
    const recentActivities: ActivityItem[] = [
        { id: 1, user: "John Doe", action: "created", target: "Ticket #1234", timestamp: "1737938997", color: "#4caf50", emoji: <AlertCircle className="text-green-500" /> },
        { id: 2, user: "Jane Smith", action: "resolved", target: "Ticket #5678", timestamp: "1737938997", color: "#2196f3", emoji: <CheckCircle className="text-blue-500" /> },
        { id: 3, user: "Mike Johnson", action: "commented on", target: "Ticket #9101", timestamp: "1737938997", color: "#ff9800", emoji: <AlertCircle className="text-orange-500" /> },
        { id: 4, user: "Sarah Brown", action: "assigned", target: "Ticket #1122 to John Doe", timestamp: "1737938997", color: "#f44336", emoji: <Ticket className="text-red-500" /> },
    ]

      return (
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative">
                        </div>
                        <h2 className='text-muted-foreground font-medium text-[13px] ml-2'>Recent Activities</h2>
                    </div>
                    <div className='group-hover:opacity-100 opacity-0 transition-all items-center'>
                        <MoreHorizontal size={22} className='text-muted-foreground cursor-pointer' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-muted-foreground/10 py-10 justify-between items-center w-full rounded-lg'>
                <div className="flex flex-col gap-4 w-full px-10">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex flex-row h-full justify-between items-center w-full">
                            <div className="flex flex-row h-full justify-center items-start gap-6">
                                <div className={`w-3 h-3 rounded-full mt-1.5 bg-${activity.color}`}>
                                    {activity.emoji}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-muted-foreground text-[13px] font-medium">{activity.user} {activity.action} {activity.target}</p>
                                    <p className="text-muted-foreground text-[13px]">{timeAgo(activity.timestamp)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}