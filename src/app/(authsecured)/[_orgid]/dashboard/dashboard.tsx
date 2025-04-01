"use client";

import { AlertCircle, Building2Icon, ChartSpline, CheckCircle, ChevronDown, Clock, Glasses, GripHorizontal, LucideTickets, MoreHorizontal, Ticket } from 'lucide-react';
import AuthChecks from '../../authchecks';
import { getAuth, User } from 'firebase/auth';
import { useEffect, useState, JSX } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import AppFooter from '@/components/footer/appfooter';


export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth();
    const [widgets, setWidgets] = useState([
        { id: "assigned-tickets", component: <AssignedTickets /> },
        { id: "ticket-stats", component: <TicketStats /> },
        { id: "site-monitoring", component: <SiteMonitoring /> },
        { id: "departments-assigned-to", component: <DepartmentsAssignedTo /> },
        { id: "recent-activities", component: <RecentActivities /> },
    ]);


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

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            setWidgets((prev) => {
                const oldIndex = prev.findIndex((w) => w.id === active.id);
                const newIndex = prev.findIndex((w) => w.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    }

    return (
        <AuthChecks>
            <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
                <div className="flex flex-col items-start  mt-10 justify-start w-full h-full">
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-screen">
                        <div className="flex flex-row items-center justify-start w-full">
                            <h1 className="text-[26px] ml-4 text-foreground font-medium">
                                Good {getGreetingTime()},
                            </h1>
                            <div className="py-[1px] transition-all ml-1.5 rounded-md text-foreground text-[26px] font-medium">
                                {user?.displayName?.split(' ')[0]}.
                            </div>
                        </div>
                        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>

                                <div className='flex flex-col w-full '>
                                    {widgets.map((widget) => (
                                        <Draggable key={widget.id} id={widget.id}>
                                            {widget.component}
                                        </Draggable>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </div>
            <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
    );
}

function Draggable({ id, children }: { id: string, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className=" group p-4 rounded-lg">
            <div className="flex justify-between  items-center">
                <div className='group-hover:opacity-100 opacity-0 transition-all items-center flex flex-row w-full cursor-default justify-between'>
                    <GripHorizontal {...listeners} size={22} className='text-muted-foreground cursor-grab' />
                    <MoreHorizontal size={22} className='text-muted-foreground cursor-pointer' />
                </div>
            </div>
            {children}
        </div>
    );
}

function SiteMonitoring() {
    const sites = [
        {
            name: 'Site 1',
            status: 'Up',
            color: 'green-500',
        },
        {
            name: 'Site 2',
            status: 'Offline',
            color: 'red-500',
        },
    ];

    const [showMore, setShowMore] = useState(true);


    return (
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative">
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-muted-foreground/5 justify-between border-muted-foreground/20 border items-center overflow-hidden w-full rounded-lg'>
                <div onClick={() => setShowMore(!showMore)} className='flex items-center border-b justify-start px-4 w-full h-10 gap-2 cursor-pointer'>
                    <ChartSpline className='text-foreground h-4 w-4 -translate-x-8 group-hover:translate-x-0 transition-all' />
                    <div className='flex flex-row items-center gap-1'>
                        <ChevronDown className={`${showMore ? "rotate-0" : "-rotate-90"} text-foreground h-4 w-4 -translate-x-7 group-hover:translate-x-0 transition-all`} />
                        <h2 className='text-foreground font-normal text-[13px] -translate-x-7 group-hover:translate-x-0 transition-all'>
                            Site Monitoring
                        </h2>
                    </div>
                </div>
                <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${showMore ? "max-h-[500px]" : "max-h-0"}`}>
                    <div className='flex flex-col w-full border-muted-foreground/20 border-t'>
                        {sites.map((site, index) => (
                            <div 
                                key={index} 
                                className='w-full flex flex-row justify-between items-center px-4 py-4 border-b last:border-none hover:bg-white/5 transition-all border-muted-foreground/20'
                            >
                                <div className='flex items-center flex-row gap-4 justify-center'>
                                    <div className={`w-3 h-3 rounded-full bg-${site.color}`}></div>
                                    <div className='flex flex-col'>
                                        <h2 className='text-foreground font-semibold text-[12px]'>{site.name}</h2>
                                        <div className='flex flex-row gap-1.5 text-[11px] text-muted-foreground/90'>
                                            <span className={`text-${site.color} text-[11px]`}>{site.status}</span>
                                            <p> · </p>
                                            <span className=''>2h 5m</span>
                                            <p> · </p>
                                            <span className='underline'>Used on STATUS PAGE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AssignedTickets() {
    const [showMore, setShowMore] = useState(true);

    return (
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative"></div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-muted-foreground/5 overflow-hidden justify-between items-center w-full border-muted-foreground/20 border rounded-lg cursor-default'>
            <div onClick={() => setShowMore(!showMore)} className='flex items-center border-b justify-start px-4 w-full h-10 gap-2 cursor-pointer'>
                    <Ticket className='text-foreground h-4 w-4 -translate-x-8 group-hover:translate-x-0 transition-all' />
                    <div className='flex flex-row items-center gap-1'>
                        <ChevronDown className={`${showMore ? "rotate-0" : "-rotate-90"} text-foreground h-4 w-4 -translate-x-7 group-hover:translate-x-0 transition-all`} />
                        <h2 className='text-foreground font-normal text-[13px] -translate-x-7 group-hover:translate-x-0 transition-all'>
                            Assigned Tickets
                        </h2>
                    </div>
                </div>
                <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${showMore ? "max-h-[500px]" : "max-h-0"}`}>
                    <div className='flex flex-row w-full justify-between border-muted-foreground/20 border-t'>
                        <div className='border-r flex items-center justify-center flex-col border-muted-foreground/20 py-10 h-full w-full'>
                            <div className='flex items-start justify-start flex-col gap-2 px-10'>
                                <p className='text-muted-foreground text-[14px] font-medium mt-0.5'>
                                    There are no tickets assigned to you, Yet..
                                </p>
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
            </div>
        </div>
    );
}

function TicketStats() {
    const stats = {
        totalTickets: 10,
        averageResponseTime: "2 hours",
        resolvedTickets: 7,
        pendingTickets: 3,
      }

    const [showMore, setShowMore] = useState(true);
    

    return (
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative">
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-muted-foreground/5 overflow-hidden justify-between items-center w-full border-muted-foreground/20 border rounded-lg cursor-default'>
                <div onClick={() => setShowMore(!showMore)} className='flex items-center border-b justify-start px-4 w-full h-10 gap-2'>
                    <LucideTickets className='text-foreground h-4 w-4 -translate-x-8 group-hover:translate-x-0 transition-all' />
                    <div className='flex flex-row items-center gap-1'>
                        <ChevronDown className={`${showMore ? "rotate-0" : "-rotate-90"} text-foreground h-4 w-4 -translate-x-7 group-hover:translate-x-0 transition-all`} />
                        <h2 className='text-foreground font-normal text-[13px] -translate-x-7 group-hover:translate-x-0 transition-all'>
                            Ticket Statistics
                        </h2>
                    </div>
                </div>
                <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${showMore ? "max-h-[500px]  py-4" : "max-h-0"}`}>
                <div className="flex gap-4 flex-wrap w-full px-10">
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

    const [showMore, setShowMore] = useState(true);

      return (
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative">
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-muted-foreground/5 overflow-hidden justify-between items-center w-full border-muted-foreground/20 border rounded-lg cursor-default'>
                <div onClick={() => setShowMore(!showMore)} className='flex border-b items-center justify-start px-4 w-full h-10 gap-2'>
                    <Glasses className='text-foreground h-4 w-4 -translate-x-8 group-hover:translate-x-0 transition-all' />
                    <div className='flex flex-row items-center gap-1'>
                        <ChevronDown className={`${showMore ? "rotate-0" : "-rotate-90"} text-foreground h-4 w-4 -translate-x-7 group-hover:translate-x-0 transition-all`} />
                        <h2 className='text-foreground font-normal text-[13px] -translate-x-7 group-hover:translate-x-0 transition-all'>
                            Recent Activities
                        </h2>
                    </div>
                </div>
                <div className={`flex flex-col gap-2 w-full justify-between overflow-hidden transition-all duration-300 ease-in-out border-muted-foreground/20 border-t ${showMore ? "max-h-[500px]" : "max-h-0"}`}>
                    <div className='px-4 py-4 flex flex-col w-full'>
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
        </div>
    );
}

function DepartmentsAssignedTo(){

    const [showMore, setShowMore] = useState(true);
    const departments = [
        {
            name: 'Engineering',
            color: 'bg-red-500',
        },
        {
            name: 'Design',
            color: 'bg-blue-500',
        },
        {
            name: 'Marketing',
            color: 'bg-green-500',
        },
        {
            name: 'Sales',
            color: 'bg-yellow-500',
        },
        {
            name: 'Support',
            color: 'bg-purple-500',
        }
    ]


    function Departments({ name, color }: { name: string, color: string }) {
        return(
            <div className={`flex items-start  px-4 py-4 gap-4 justify-center flex-col w-1/2 h-full rounded-lg ${color} hover:bg-opacity-100 transition-all bg-opacity-25`}>
                <div className={`bg-muted-foreground/20 font-semibold h-7 w-7 rounded-full flex items-center justify-center`}>
                    {name.split('')[0]}
                </div>
                <h2 className='text-white font-semibold text-[13px]'>{name}</h2>
            </div>
        )
    }

    return(
        <div className='flex flex-col group gap-4 w-full h-full'>
        <div className='flex flex-row justify-start items-center w-full'>
            <div className='flex flex-row justify-between w-full'>
                <div className='flex flex-row'>
                    <div className="relative">
                    </div>
                </div>
            </div>
        </div>
        <div className='flex flex-col bg-muted-foreground/5 overflow-hidden justify-between items-center w-full border-muted-foreground/20 border rounded-lg cursor-default'>
            <div onClick={() => setShowMore(!showMore)} className='flex border-b items-center justify-start px-4 w-full h-10 gap-2'>
                    <Building2Icon className='text-foreground h-4 w-4 -translate-x-8 group-hover:translate-x-0 transition-all' />
                    <div className='flex flex-row items-center gap-1'>
                        <ChevronDown className={`${showMore ? "rotate-0" : "-rotate-90"} text-foreground h-4 w-4 -translate-x-7 group-hover:translate-x-0 transition-all`} />
                        <h2 className='text-foreground font-normal text-[13px] -translate-x-7 group-hover:translate-x-0 transition-all'>
                            Departments
                        </h2>
                    </div>
                </div>
                <div className={`w-full overflow-hidden flex flex-row gap-2 transition-all duration-300 ease-in-out ${showMore ? "max-h-[500px]" : "max-h-0"}`}>
                    <div className='p-2 flex flex-row gap-2 w-full'>
                    {
                        departments.map((department, index) => (
                            <Departments key={index} name={department.name} color={department.color}/>
                        ))
                    }
                    </div>
            </div>
        </div>
        </div>
    )
}